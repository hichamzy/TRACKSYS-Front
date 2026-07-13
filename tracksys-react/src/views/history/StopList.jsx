import { HIST_STOPS } from '../../data/history.js';

/** Chronologie des arrêts — l'arrêt courant est surligné selon l'avancement de la lecture */
export default function StopList({ activeIndex }) {
  return (
    <div style={{ overflowY: 'auto' }}>
      {HIST_STOPS.map((s, i) => (
        <div className={`stop-item${i === activeIndex ? ' active' : ''}`} key={`${s.t}-${i}`}>
          <div className="stop-n">{s.type === 'start' ? 'D' : s.type === 'end' ? 'A' : i}</div>
          <div className="stop-b">
            <b>{s.n}</b>
            <div className="stop-t">{s.t}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
