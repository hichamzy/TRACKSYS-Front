import Icon from '../../components/icons/Icon.jsx';
import Modal from '../../components/ui/Modal.jsx';
import MiniMap from '../../components/map/MiniMap.jsx';
import { avantImg, apresImg } from '../../utils/photos.js';
import { SLA_MAP, STATUS_ORDER } from '../../data/complaints.js';
import { useApp } from '../../context/AppContext.jsx';

/** Suivi du statut : Reçue → En cours → Résolue */
function Timeline({ complaint }) {
  const ci = STATUS_ORDER.indexOf(complaint.status);
  const resolved = complaint.status === 'Résolue';

  return (
    <div className="tl">
      {STATUS_ORDER.map((s, i) => {
        const done = resolved || i < ci;
        const cur = !resolved && i === ci;
        const mark = done ? '✓' : cur ? '●' : '';
        const time = i === 0 ? complaint.date.replace("Aujourd'hui ", '') : done ? '✓' : '—';

        return (
          <div className={`tl-step ${done ? 'done' : cur ? 'cur' : ''}`} key={s}>
            <div className="tl-dot">{mark}</div>
            <div className="tl-lbl">{s}</div>
            <div className="tl-time">{time}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function ComplaintModal() {
  const { complaints, openComplaintId, setOpenComplaintId, vehicles, assignComplaintVehicle, resolveComplaint } = useApp();

  const c = complaints.find((x) => x.id === openComplaintId);
  if (!c) return null;

  const resolved = c.status === 'Résolue';
  const close = () => setOpenComplaintId(null);

  const handleAssign = (e) => {
    const vehicle = vehicles.find((v) => v.id === e.target.value);
    if (vehicle) assignComplaintVehicle(c._backendId, vehicle._backendId);
  };

  return (
    <Modal open onClose={close}>
      <div className="modal-head">
        <div className="veh-ico">
          <Icon name="chat" width={1.8} size={20} />
        </div>
        <div>
          <div className="modal-title">{c.type}</div>
          <div className="modal-sub">
            {c.id} · {c.zone}
          </div>
        </div>

        <span className={`prio p-${c.prio.toLowerCase()}`} style={{ marginLeft: 8 }}>
          {c.prio}
        </span>
        <span
          className={`badge ${resolved ? 'b-active' : c.status === 'Reçue' ? 'b-off' : 'b-idle'}`}
          style={{ marginBottom: 0 }}
        >
          {c.status}
        </span>

        <span className="modal-close" onClick={close} role="button" tabIndex={0} aria-label="Fermer">
          <Icon name="close" size={18} />
        </span>
      </div>

      <div className="modal-body">
        <div className="mlabel">Photos du signalement</div>
        <div className="ba-grid">
          <div className="ba">
            <div className="ba-img" style={{ backgroundImage: `url('${avantImg(c.type)}')` }}>
              <span className="ba-tag">AVANT</span>
            </div>
          </div>

          <div className="ba">
            {resolved ? (
              <div className="ba-img" style={{ backgroundImage: `url('${apresImg()}')` }}>
                <span className="ba-tag after">APRÈS</span>
              </div>
            ) : (
              <div className="ba-empty">
                Photo « après »
                <br />
                disponible à la clôture
                <br />
                par l'équipe d'intervention
              </div>
            )}
          </div>
        </div>

        <div className="mlabel">Détails</div>
        <div className="rc-details">
          <div className="rc-d">
            <span className="k">Catégorie</span>
            <span className="v">{c.type}</span>
          </div>
          <div className="rc-d">
            <span className="k">Priorité</span>
            <span className="v">{c.prio}</span>
          </div>
          <div className="rc-d">
            <span className="k">Adresse</span>
            <span className="v">{c.zone}</span>
          </div>
          <div className="rc-d">
            <span className="k">Citoyen</span>
            <span className="v">Anonyme</span>
          </div>
          <div className="rc-d">
            <span className="k">Signalée le</span>
            <span className="v">{c.date}</span>
          </div>
          <div className="rc-d">
            <span className="k">Délai cible</span>
            <span className="v">{SLA_MAP[c.type] || '—'}</span>
          </div>
          <div className="rc-d">
            <span className="k">Statut</span>
            <span className="v">{c.status}</span>
          </div>
          <div className="rc-d">
            <span className="k">Véhicule affecté</span>
            <span className="v">
              {resolved ? (
                c.assign || '—'
              ) : (
                <select value={c.assign || ''} onChange={handleAssign}>
                  <option value="">— Non affecté —</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.id}</option>
                  ))}
                </select>
              )}
            </span>
          </div>
        </div>

        <div className="mlabel">Localisation</div>
        <div className="rc-map">
          <MiniMap lng={c.lng} lat={c.lat} />
        </div>

        <div className="mlabel">Suivi du statut</div>
        <Timeline complaint={c} />

        {!resolved && (
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => resolveComplaint(c._backendId)}>
            Marquer comme résolue
          </button>
        )}
      </div>
    </Modal>
  );
}
