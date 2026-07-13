import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { OSM_STYLE, CASABLANCA_CENTER, DEFAULT_ZOOM } from './mapStyle.js';

/** Instancie une carte MapLibre (tuiles OSM) dans le conteneur ref et expose l'instance une fois chargée. */
export default function useMapLibre({ center = CASABLANCA_CENTER, zoom = DEFAULT_ZOOM } = {}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center,
      zoom,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.on('load', () => setReady(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef, mapRef, ready };
}
