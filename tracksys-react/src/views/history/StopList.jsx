import { useEffect, useState } from 'react';
import { reverseGeocode } from '../../utils/nominatim.js';

/** Chronologie des arrêts — l'arrêt courant est surligné selon l'avancement de la lecture */
export default function StopList({ stops, activeIndex }) {
  const [streetNames, setStreetNames] = useState({});

  // Résout le nom de rue réel (OpenStreetMap/Nominatim) pour chaque arrêt, séquentiellement.
  useEffect(() => {
    let cancelled = false;
    setStreetNames({});
    const applyName = (i, name) => {
      if (!cancelled && name) setStreetNames((prev) => ({ ...prev, [i]: name }));
    };
    stops.forEach((s, i) => {
      reverseGeocode(s.lat, s.lng, s.n).then((name) => applyName(i, name));
    });
    return () => {
      cancelled = true;
    };
  }, [stops]);

  if (!stops.length) return <div className="rc-empty">Aucun point pour ce trajet.</div>;

  return (
    <div style={{ overflowY: 'auto' }}>
      {stops.map((s, i) => (
        <div className={`stop-item${i === activeIndex ? ' active' : ''}`} key={`${s.t}-${i}`}>
          <div className="stop-n">{s.type === 'start' ? 'D' : s.type === 'end' ? 'A' : i}</div>
          <div className="stop-b">
            <b>{streetNames[i] || s.n}</b>
            <div className="stop-t">{s.t}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
