import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useMapLibre from './useMapLibre.js';

/** Mini-carte de localisation d'une réclamation (modale) */
export default function MiniMap({ lng, lat }) {
  const { containerRef, mapRef, ready } = useMapLibre({ center: [lng, lat], zoom: 14.5 });

  useEffect(() => {
    if (!ready) return undefined;
    const el = document.createElement('div');
    el.className = 'map-pin-marker';
    el.innerHTML = '<span class="map-pin-halo"></span><span class="map-pin-dot pulse"></span>';
    const marker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(mapRef.current);
    return () => marker.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, lng, lat]);

  return <div ref={containerRef} className="map-svg" />;
}
