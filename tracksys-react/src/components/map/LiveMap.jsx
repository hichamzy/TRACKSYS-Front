import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useMapLibre from './useMapLibre.js';
import useFleetAnimation from '../../hooks/useFleetAnimation.js';
import { STATUS_COLOR } from '../../data/vehicles.js';
import { useApp } from '../../context/AppContext.jsx';

function truckEl(v) {
  const el = document.createElement('div');
  el.className = 'map-truck-marker';
  el.innerHTML = `
    ${v.status === 'active' ? '<span class="map-truck-halo"></span>' : ''}
    <span class="map-truck-dot" style="background:${STATUS_COLOR[v.status]}"></span>
    <span class="map-truck-label">${v.id}</span>
  `;
  return el;
}

function pinEl(c) {
  const el = document.createElement('div');
  el.className = 'map-pin-marker';
  el.innerHTML = `
    <span class="map-pin-halo"></span>
    <span class="map-pin-dot${c.prio === 'Haute' ? ' pulse' : ''}"></span>
  `;
  return el;
}

export default function LiveMap() {
  const { vehicles, openComplaints, selectVehicle, setOpenComplaintId, followId } = useApp();
  const { containerRef, mapRef, ready } = useMapLibre();

  const markersRef = useRef({});
  const ringMarkerRef = useRef(null);
  const nodesRef = useRef({}); // { [id]: { setPos(lng,lat) } } — pont vers useFleetAnimation

  // Marqueurs véhicules
  useEffect(() => {
    if (!ready) return undefined;
    const map = mapRef.current;
    const markers = markersRef.current;

    vehicles.forEach((v) => {
      if (markers[v.id]) return;
      const el = truckEl(v);
      el.addEventListener('click', () => selectVehicle(v.id));
      const marker = new maplibregl.Marker({ element: el }).setLngLat(v.route[0]).addTo(map);
      markers[v.id] = marker;
      nodesRef.current[v.id] = {
        setPos: (lng, lat) => marker.setLngLat([lng, lat]),
      };
    });

    Object.keys(markers).forEach((id) => {
      if (!vehicles.some((v) => v.id === id)) {
        markers[id].remove();
        delete markers[id];
        delete nodesRef.current[id];
      }
    });

    // Anneau de suivi en direct
    if (!ringMarkerRef.current) {
      const ringEl = document.createElement('div');
      ringEl.className = 'map-follow-ring';
      ringEl.style.opacity = '0';
      ringMarkerRef.current = new maplibregl.Marker({ element: ringEl }).setLngLat(vehicles[0]?.route[0] ?? [0, 0]).addTo(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, vehicles]);

  // Marqueurs réclamations ouvertes
  useEffect(() => {
    if (!ready) return undefined;
    const map = mapRef.current;
    const pins = openComplaints.map((c) => {
      const el = pinEl(c);
      el.addEventListener('click', () => setOpenComplaintId(c.id));
      return new maplibregl.Marker({ element: el }).setLngLat([c.lng, c.lat]).addTo(map);
    });
    return () => pins.forEach((p) => p.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, openComplaints]);

  // Anneau suivi : visible + positionné sur le véhicule suivi
  useEffect(() => {
    const ring = ringMarkerRef.current;
    if (!ring) return;
    const el = ring.getElement();
    el.style.opacity = followId ? '0.9' : '0';
  }, [followId]);

  useFleetAnimation(vehicles, nodesRef, ringMarkerRef, followId);

  return <div ref={containerRef} className="map-svg" />;
}
