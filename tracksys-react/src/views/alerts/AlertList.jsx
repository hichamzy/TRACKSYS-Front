import { ALERT_TYPES, SEV_LABEL } from '../../data/alerts.jsx';
import { useApp } from '../../context/AppContext.jsx';

/** Une ligne d'alerte du flux */
function AlertRow({ alert }) {
  const { showToast } = useApp();
  const t = ALERT_TYPES[alert.k];

  return (
    <div
      className={`al-row${alert.unread ? ' unread' : ''}`}
      onClick={() => showToast(`${alert.id} — ${t.label} (${alert.veh})`)}
      role="button"
      tabIndex={0}
    >
      <div className={`al-ico sev-${t.sev}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          {t.path}
        </svg>
      </div>

      <div className="al-main">
        <div className="al-t">
          {alert.unread && <span className="al-new" />}
          {t.label}
          <span className={`sev-tag t-${t.sev}`}>{SEV_LABEL[t.sev]}</span>
        </div>
        <div className="al-d">
          {alert.det.map((seg, i) => (seg.b ? <b key={i}>{seg.t}</b> : <span key={i}>{seg.t}</span>))}
        </div>
      </div>

      <div className="al-side">
        <div className="al-time">{alert.time}</div>
        <span className="al-veh">{alert.veh}</span>
      </div>
    </div>
  );
}

export default function AlertList({ alerts }) {
  if (!alerts.length) return <div className="rc-empty">Aucune alerte pour ce filtre.</div>;
  return alerts.map((a) => <AlertRow key={a.id} alert={a} />);
}
