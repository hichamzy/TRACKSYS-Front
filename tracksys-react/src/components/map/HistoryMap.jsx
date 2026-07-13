import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useMapLibre from './useMapLibre.js';
import { HIST_ROUTE, HIST_STOPS } from '../../data/history.js';
import { measureRoute, pointAt } from '../../utils/geo.js';

const ROUTE_SOURCE_ID = 'hist-route';
const ROUTE_LAYER_ID = 'hist-route-line';

/**
 * Carte de l'historique : tracé du parcours, arrêts numérotés (D = départ, A = arrivée)
 * et marqueur du véhicule positionné selon la progression `progress` (0 → 1).
 */
export default function HistoryMap({ progress = 0, vehicleId = 'BN-04' }) {
  const { segLen, total } = useMemo(() => measureRoute(HIST_ROUTE), []);
  const [mx, my] = pointAt(HIST_ROUTE, segLen, total, progress);

  const { containerRef, mapRef, ready } = useMapLibre({ center: HIST_ROUTE[0], zoom: 13.5 });
  const vehicleMarkerRef = useRef(null);

  // Tracé + arrêts + fit bounds (une fois la carte prête)
  useEffect(() => {
    if (!ready) return undefined;
    const map = mapRef.current;

    map.addSource(ROUTE_SOURCE_ID, {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: HIST_ROUTE } },
    });
    map.addLayer({
      id: ROUTE_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#22B2CE', 'line-width': 4 },
    });

    const bounds = HIST_ROUTE.reduce((b, p) => b.extend(p), new maplibregl.LngLatBounds(HIST_ROUTE[0], HIST_ROUTE[0]));
    map.fitBounds(bounds, { padding: 40, duration: 0 });

    const stopMarkers = HIST_STOPS.map((s, i) => {
      const col = s.type ? '#2BB673' : '#1B3A6B';
      let mark = i;
      if (s.type === 'start') mark = 'D';
      else if (s.type === 'end') mark = 'A';
      const el = document.createElement('div');
      el.className = 'map-stop-marker';
      el.style.setProperty('--stop-color', col);
      el.textContent = mark;
      return new maplibregl.Marker({ element: el }).setLngLat([s.lng, s.lat]).addTo(map);
    });

    const vehicleEl = document.createElement('div');
    vehicleEl.className = 'map-truck-marker';
    vehicleEl.innerHTML = `
      <span class="map-truck-halo"></span>
      <span class="map-truck-dot" style="background:#22B2CE"></span>
      <span class="map-truck-label">${vehicleId}</span>
    `;
    vehicleMarkerRef.current = new maplibregl.Marker({ element: vehicleEl }).setLngLat([mx, my]).addTo(map);

    return () => {
      stopMarkers.forEach((m) => m.remove());
      vehicleMarkerRef.current?.remove();
      vehicleMarkerRef.current = null;
      if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
      if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, vehicleId]);

  // Position du véhicule le long du trajet
  useEffect(() => {
    vehicleMarkerRef.current?.setLngLat([mx, my]);
  }, [mx, my]);

  return <div ref={containerRef} className="map-svg" />;
}
