import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { positionsApi } from '../api/endpoints/positionsApi.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RECONNECT_POLL_INTERVAL_MS = 5000; // filet de secours pendant une coupure SignalR

/**
 * Remplace useFleetAnimation : positionne les véhicules sur leurs fixs GPS réels,
 * corrélés via `flespiIdent`. Même contrat de sortie que l'ancien hook —
 * nodesRef.current[id].setPos(lng, lat) — donc LiveMap.jsx est inchangé.
 *
 * Temps réel via SignalR (hub public /hubs/positions, événement "PositionsUpdated"
 * poussé par le backend juste après chaque ingestion Flespi réussie). Un fetch initial
 * (GET /api/positions/live) peuple l'état au montage ; en cas de coupure de connexion
 * SignalR, un polling de secours prend le relais tant que la reconnexion n'a pas repris.
 * Interpolation fluide (RAF) entre la dernière position connue et le nouveau fix reçu ;
 * véhicules sans position live restent sur lastKnownLat/Lng.
 *
 * @param {Array} vehicles
 * @param {object} nodesRef
 * @param {object} ringMarkerRef
 * @param {string|null} followId
 */
export default function useLiveGpsSync(vehicles, nodesRef, ringMarkerRef, followId) {
  const motion = useRef({}); // { [id]: { from: [lng,lat], to: [lng,lat], t } }
  const followRef = useRef(followId);
  followRef.current = followId;
  const vehiclesRef = useRef(vehicles);
  vehiclesRef.current = vehicles;

  // Initialise chaque véhicule sur sa dernière position connue (fallback avant le premier fix)
  useEffect(() => {
    vehicles.forEach((v) => {
      if (motion.current[v.id]) return;
      const initial = v.lastKnownLng != null && v.lastKnownLat != null ? [v.lastKnownLng, v.lastKnownLat] : v.route[0];
      motion.current[v.id] = { from: initial.slice(), to: initial.slice(), t: 1 };
    });
  }, [vehicles]);

  const applyFix = (fix) => {
    const v = vehiclesRef.current.find((veh) => veh.flespiIdent === fix.ident);
    if (!v) return;
    const m = motion.current[v.id];
    if (!m) return;
    const nextPos = [fix.longitude, fix.latitude];
    if (nextPos[0] === m.to[0] && nextPos[1] === m.to[1]) return;
    m.from = m.t < 1 ? currentInterpolated(m) : m.to;
    m.to = nextPos;
    m.t = 0;
  };

  // Connexion SignalR : reçoit les positions poussées par le backend en temps réel
  useEffect(() => {
    let cancelled = false;
    let fallbackInterval = null;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/positions`)
      .withAutomaticReconnect()
      .build();

    connection.on('PositionsUpdated', (positions) => {
      positions.forEach(applyFix);
    });

    const startFallbackPolling = () => {
      if (fallbackInterval) return;
      fallbackInterval = setInterval(async () => {
        try {
          const positions = await positionsApi.getLive();
          positions.forEach(applyFix);
        } catch {
          /* nouvelle tentative au prochain intervalle */
        }
      }, RECONNECT_POLL_INTERVAL_MS);
    };

    const stopFallbackPolling = () => {
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
        fallbackInterval = null;
      }
    };

    connection.onreconnecting(startFallbackPolling);
    connection.onreconnected(stopFallbackPolling);
    connection.onclose(startFallbackPolling);

    // État initial : fetch REST classique, puis bascule sur le flux temps réel
    positionsApi
      .getLive()
      .then((positions) => {
        if (!cancelled) positions.forEach(applyFix);
      })
      .catch(() => {});

    connection.start().catch(() => {
      if (!cancelled) startFallbackPolling();
    });

    return () => {
      cancelled = true;
      stopFallbackPolling();
      connection.stop();
    };
  }, []);

  // Boucle RAF : interpole from -> to, pousse la position aux marqueurs (hors cycle de rendu React)
  useEffect(() => {
    let raf;

    const step = () => {
      vehiclesRef.current.forEach((v) => {
        const m = motion.current[v.id];
        const node = nodesRef.current[v.id];
        if (!m) return;

        if (m.t < 1) {
          m.t = Math.min(1, m.t + 0.03);
        }
        const pos = currentInterpolated(m);
        if (node) node.setPos(pos[0], pos[1]);
      });

      const ring = ringMarkerRef.current;
      if (ring) {
        const fid = followRef.current;
        const fm = fid ? motion.current[fid] : null;
        if (fm) ring.setLngLat(currentInterpolated(fm));
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [nodesRef, ringMarkerRef]);
}

function currentInterpolated(m) {
  return [m.from[0] + (m.to[0] - m.from[0]) * m.t, m.from[1] + (m.to[1] - m.from[1]) * m.t];
}
