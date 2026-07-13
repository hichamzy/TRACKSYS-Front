import { useEffect, useState } from 'react';
import { HIST_STOPS } from '../../data/history.js';
import { reverseGeocode } from '../../utils/nominatim.js';

/** Chronologie des arrêts — l'arrêt courant est surligné selon l'avancement de la lecture */
export default function StopList({ activeIndex }) {
  const [streetNames, setStreetNames] = useState({});

  // Résout le nom de rue réel (OpenStreetMap/Nominatim) pour chaque arrêt, séquentiellement.
  // Le nom de la maquette (`s.n`) reste affiché tant que la résolution n'est pas terminée.
  useEffect(() => {
    let cancelled = false;
    const applyName = (i, name) => {
      if (!cancelled && name) setStreetNames((prev) => ({ ...prev, [i]: name }));
    };
    HIST_STOPS.forEach((s, i) => {
      reverseGeocode(s.lat, s.lng, s.n).then((name) => applyName(i, name));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ overflowY: 'auto' }}>
      {HIST_STOPS.map((s, i) => (
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
