import { useState } from 'react';
import Icon from '../../components/icons/Icon.jsx';
import { FLEET_FILTERS, STATUS_MAP } from '../../data/vehicles.js';
import { useApp } from '../../context/AppContext.jsx';

export default function VehicleList() {
  const { vehicles, selectedVehId, selectVehicle } = useApp();
  const [filter, setFilter] = useState('all');

  const list = vehicles.filter((v) => filter === 'all' || v.status === filter);

  const sideInfo = (v) => {
    if (v.status === 'active') return { top: `${v.speed} km/h`, bottom: 'en tournée' };
    if (v.status === 'idle') return { top: 'Arrêt', bottom: v.lastStop };
    return { top: '—', bottom: 'hors service' };
  };

  return (
    <div className="float flt-list">
      <div className="flt-head">
        <h3>Flotte</h3>
        <span className="count">{vehicles.length} véhicules</span>
      </div>

      <div className="filter-tabs">
        {FLEET_FILTERS.map((f) => (
          <div
            key={f.key}
            className={`ftab${filter === f.key ? ' on' : ''}`}
            onClick={() => setFilter(f.key)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFilter(f.key)}
          >
            {f.label}
          </div>
        ))}
      </div>

      <div className="col-body" style={{ overflowY: 'auto' }}>
        {list.map((v) => {
          const s = sideInfo(v);
          return (
            <div
              key={v.id}
              className={`veh${selectedVehId === v.id ? ' sel' : ''}`}
              onClick={() => selectVehicle(v.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && selectVehicle(v.id)}
            >
              <div className="veh-ico">
                <Icon name="truckSmall" width={1.7} />
              </div>
              <div className="veh-main">
                <div className="veh-id">
                  <span className={`stat ${STATUS_MAP[v.status].dot}`} />
                  {v.id}
                </div>
                <div className="veh-plate">{v.plate}</div>
              </div>
              <div className="veh-side">
                <b>{s.top}</b>
                {s.bottom}
              </div>
            </div>
          );
        })}
        {!list.length && <div className="rc-empty">Aucun véhicule pour ce filtre.</div>}
      </div>
    </div>
  );
}
