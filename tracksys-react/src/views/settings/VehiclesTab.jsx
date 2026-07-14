import { useState } from 'react';
import Icon from '../../components/icons/Icon.jsx';
import { STATUS_MAP } from '../../data/vehicles.js';
import { useApp } from '../../context/AppContext.jsx';

const NEXT_STATUS = { active: 'idle', idle: 'off', off: 'active' };

export default function VehiclesTab() {
  const { vehicles, vehicleTypes, addVehicle, changeVehicleStatus } = useApp();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: '', plate: '', type: '', imei: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    addVehicle({ ...form, type: form.type || vehicleTypes[0]?.label });
    setForm({ id: '', plate: '', type: '', imei: '' });
    setOpen(false);
  };

  return (
    <div className="set-panel show">
      <div className="sec-head">
        <h2>Référentiel véhicules</h2>
        <button className="b b-cyan sp" onClick={() => setOpen((o) => !o)}>
          <Icon name="plus" />
          Ajouter un véhicule
        </button>
      </div>

      {open && (
        <div className="addform">
          <h4>Nouveau véhicule</h4>
          <div className="form-grid">
            <div className="field">
              <label>Identifiant</label>
              <input placeholder="ex. BN-17" value={form.id} onChange={set('id')} />
            </div>
            <div className="field">
              <label>Immatriculation</label>
              <input placeholder="0000-A-6" value={form.plate} onChange={set('plate')} />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={form.type || vehicleTypes[0]?.label || ''} onChange={set('type')}>
                {vehicleTypes.map((t) => (
                  <option key={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Balise GPS (IMEI)</label>
              <input placeholder="FMC650 · 867…" value={form.imei} onChange={set('imei')} />
            </div>
          </div>

          <div className="btn-row">
            <button className="b b-cyan" onClick={save}>
              <Icon name="check" />
              Enregistrer
            </button>
            <button className="b" onClick={() => setOpen(false)}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="panel">
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Immatriculation</th>
              <th>Type</th>
              <th>Chauffeur</th>
              <th>Balise GPS</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td className="mono" style={{ fontWeight: 600 }}>{v.id}</td>
                <td className="mono">{v.plate}</td>
                <td>{v.type}</td>
                <td>{v.driver || '—'}</td>
                <td className="mono" style={{ fontSize: 11 }}>{v.imei}</td>
                <td>
                  <span className={`chip ${STATUS_MAP[v.status].chip}`}>{STATUS_MAP[v.status].refLabel}</span>
                </td>
                <td>
                  <span
                    className="row-act"
                    onClick={() => changeVehicleStatus(v._backendId, NEXT_STATUS[v.status] ?? 'idle')}
                    role="button"
                    tabIndex={0}
                  >
                    ⋯
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
