import { useCallback, useEffect, useState } from 'react';
import Icon from '../../components/icons/Icon.jsx';
import { tenancyApi } from '../../api/endpoints/tenancyApi.js';
import { ApiError } from '../../api/httpClient.js';
import { useApp } from '../../context/AppContext.jsx';

const CITY_EMPTY = { name: '', code: '' };

export default function CitiesTab() {
  const { showToast } = useApp();
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(CITY_EMPTY);

  const refetch = useCallback(async () => {
    try {
      setCities(await tenancyApi.getCities());
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Échec du chargement des villes');
    }
  }, [showToast]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.name.trim() || !form.code.trim()) return;
    try {
      await tenancyApi.createCity(form);
      await refetch();
      showToast(`Ville ${form.name} créée`);
      setForm(CITY_EMPTY);
      setOpen(false);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Échec de la création de la ville');
    }
  };

  const toggleActive = async (city) => {
    try {
      await tenancyApi.updateCity(city.id, { name: city.name, isActive: !city.isActive });
      await refetch();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Échec de la mise à jour de la ville');
    }
  };

  return (
    <div className="set-panel show">
      <div className="sec-head">
        <h2>Villes</h2>
        <button className="b b-cyan sp" onClick={() => setOpen((o) => !o)}>
          <Icon name="plus" />
          Ajouter une ville
        </button>
      </div>

      {open && (
        <div className="addform">
          <h4>Nouvelle ville</h4>
          <div className="form-grid">
            <div className="field">
              <label>Nom</label>
              <input placeholder="ex. Casablanca" value={form.name} onChange={set('name')} />
            </div>
            <div className="field">
              <label>Code</label>
              <input placeholder="ex. CASA" value={form.code} onChange={set('code')} />
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
              <th>Nom</th>
              <th>Code</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td className="mono">{c.code}</td>
                <td>
                  <span className={`chip ${c.isActive ? 'c-on' : 'c-off'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td>
                  <span className="row-act" onClick={() => toggleActive(c)} role="button" tabIndex={0}>
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
