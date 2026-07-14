import Icon from '../../components/icons/Icon.jsx';
import { STATUS_MAP } from '../../data/vehicles.js';
import { useApp } from '../../context/AppContext.jsx';

export default function VehicleDetail() {
  const { vehicles, selectedVehId, closeDetail, followId, toggleFollow, gotoHistory } = useApp();

  const v = vehicles.find((x) => x.id === selectedVehId);
  const following = followId === selectedVehId;

  return (
    <div className={`float flt-detail${v ? ' show' : ''}`}>
      <div className="flt-head">
        <h3>Détail véhicule</h3>
        <span className="flt-close" onClick={closeDetail} role="button" tabIndex={0} aria-label="Fermer">
          <Icon name="close" size={16} />
        </span>
      </div>

      {v && (
        <div className="detail">
          <div className="dt-head">
            <div className="veh-ico" style={{ background: 'rgba(34,178,206,.1)', color: 'var(--cyan-deep)' }}>
              <Icon name="truckSmall" width={1.7} />
            </div>
            <div>
              <div className="dt-title">{v.id}</div>
              <div className="dt-sub">{v.plate}</div>
            </div>
          </div>

          <span className={`badge ${STATUS_MAP[v.status].badge}`}>
            <span className={`stat ${STATUS_MAP[v.status].dot}`} />
            {STATUS_MAP[v.status].label}
          </span>

          <div className="metric-grid">
            <div className="metric">
              <div className="l">Vitesse actuelle</div>
              <div className="v">
                {v.speed}
                <small> km/h</small>
              </div>
            </div>
            <div className="metric">
              <div className="l">Distance du jour</div>
              <div className="v">
                {String(v.distToday).replace('.', ',')}
                <small> km</small>
              </div>
            </div>
          </div>

          <div className="dt-row">
            <span className="k">Type</span>
            <span className="v" style={{ fontFamily: 'Inter' }}>{v.type}</span>
          </div>
          <div className="dt-row">
            <span className="k">Chauffeur</span>
            <span className="v" style={{ fontFamily: 'Inter' }}>{v.driver}</span>
          </div>
          <div className="dt-row">
            <span className="k">Temps de conduite</span>
            <span className="v">{v.drive}</span>
          </div>
          <div className="dt-row">
            <span className="k">Dernier arrêt</span>
            <span className="v">{v.lastStop}</span>
          </div>
          <div className="dt-row">
            <span className="k">Position GPS</span>
            <span className="v">
              {v.lastKnownLat != null && v.lastKnownLng != null
                ? `${v.lastKnownLat.toFixed(4)}°N ${Math.abs(v.lastKnownLng).toFixed(4)}°O`
                : '—'}
            </span>
          </div>

          <button
            className={`btn ${following ? 'btn-ghost' : 'btn-primary'}`}
            style={following ? { borderColor: 'var(--cyan)', color: 'var(--cyan-deep)' } : undefined}
            onClick={() => toggleFollow(v.id)}
          >
            <Icon name={following ? 'stopSquare' : 'pin'} size={15} filled={false} />
            {following ? 'Suivi actif — arrêter' : 'Suivre en direct'}
          </button>

          <button className="btn btn-ghost" onClick={() => gotoHistory(v.id)}>
            Voir l'historique des trajets
          </button>
        </div>
      )}
    </div>
  );
}
