import { useEffect, useRef } from 'react';
import { positionsApi } from '../api/endpoints/positionsApi.js';

const POLL_INTERVAL_MS = 4000;

/**
 * Remplace useFleetAnimation : positionne les véhicules sur leurs fixs GPS réels
 * (GET /api/positions/live, public), corrélés via `flespiIdent`. Même contrat de sortie
 * que l'ancien hook — nodesRef.current[id].setPos(lng, lat) — donc LiveMap.jsx est inchangé.
 * Interpolation fluide (RAF) entre la dernière position connue et le nouveau fix reçu à
 * chaque poll ; véhicules sans position live restent sur lastKnownLat/Lng.
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

  // Initialise chaque véhicule sur sa dernière position connue (fallback avant le premier poll)
  useEffect(() => {
    vehicles.forEach((v) => {
      if (motion.current[v.id]) return;
      const initial = v.lastKnownLng != null && v.lastKnownLat != null ? [v.lastKnownLng, v.lastKnownLat] : v.route[0];
      motion.current[v.id] = { from: initial.slice(), to: initial.slice(), t: 1 };
    });
  }, [vehicles]);

  // Poll GET /api/positions/live, corrèle par flespiIdent, fixe une nouvelle cible d'interpolation
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const positions = await positionsApi.getLive();
        if (cancelled) return;
        const byIdent = new Map(positions.map((p) => [p.ident, p]));

        vehiclesRef.current.forEach((v) => {
          if (!v.flespiIdent) return;
          const fix = byIdent.get(v.flespiIdent);
          if (!fix) return;
          const m = motion.current[v.id];
          if (!m) return;
          const nextPos = [fix.longitude, fix.latitude];
          if (nextPos[0] === m.to[0] && nextPos[1] === m.to[1]) return;
          m.from = m.t < 1 ? currentInterpolated(m) : m.to;
          m.to = nextPos;
          m.t = 0;
        });
      } catch {
        /* poll suivant réessaiera — pas d'état d'erreur affiché sur la carte */
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
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
