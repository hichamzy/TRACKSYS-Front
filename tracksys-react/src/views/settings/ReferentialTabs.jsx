import { useEffect, useState } from 'react';
import Icon from '../../components/icons/Icon.jsx';
import Panel from '../../components/ui/Panel.jsx';
import RuleList from '../alerts/RuleList.jsx';
import ChannelList from '../alerts/ChannelList.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { tenancyApi } from '../../api/endpoints/tenancyApi.js';

const STATUS_CHIP = { 'En service': 'c-on', Repos: 'c-idle', Absent: 'c-off' };

/* --- Chauffeurs --- */
const DRIVER_EMPTY = { fullName: '', phone: '', licenceNumber: '' };

export function DriversTab() {
  const { drivers, addDriver, changeDriverStatus } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(DRIVER_EMPTY);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    if (!form.fullName.trim()) return;
    addDriver(form);
    setForm(DRIVER_EMPTY);
    setOpen(false);
  };

  return (
    <div className="set-panel show">
      <div className="sec-head">
        <h2>Référentiel chauffeurs</h2>
        <button className="b b-cyan sp" onClick={() => setOpen((o) => !o)}>
          <Icon name="plus" />
          Ajouter un chauffeur
        </button>
      </div>

      {open && (
        <div className="addform">
          <h4>Nouveau chauffeur</h4>
          <div className="form-grid">
            <div className="field">
              <label>Nom complet</label>
              <input placeholder="ex. H. El Amrani" value={form.fullName} onChange={set('fullName')} />
            </div>
            <div className="field">
              <label>Téléphone</label>
              <input placeholder="06 00 00 00 00" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="field">
              <label>Permis</label>
              <input placeholder="C-123456" value={form.licenceNumber} onChange={set('licenceNumber')} />
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
              <th>Téléphone</th>
              <th>Permis</th>
              <th>Véhicule</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td>{d.fullName}</td>
                <td className="mono">{d.phone || '—'}</td>
                <td className="mono">{d.licenceNumber || '—'}</td>
                <td className="mono">{d.currentVehicleCode || '—'}</td>
                <td>
                  <span className={`chip ${STATUS_CHIP[d.status] || 'c-idle'}`}>{d.status}</span>
                </td>
                <td>
                  <span
                    className="row-act"
                    onClick={() => changeDriverStatus(d.id, d.status === 'En service' ? 'Repos' : 'En service')}
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

/* --- Règles d'alerte (mêmes règles que la vue Alertes) --- */
export function RulesTab() {
  return (
    <div className="set-panel show">
      <div className="sec-head">
        <h2>Règles d'alerte</h2>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--muted)' }}>
          Seuils de déclenchement et canaux de notification
        </span>
      </div>

      <div className="panel">
        <RuleList />
      </div>

      <Panel title="Canaux de notification" style={{ marginTop: 16 }}>
        <ChannelList />
      </Panel>
    </div>
  );
}

/* --- Catégories de réclamation --- */
const CATEGORY_EMPTY = { label: '', icon: '', defaultPriority: 'Moyenne', slaHours: '24' };

export function CategoriesTab() {
  const { complaintCategories, addComplaintCategory, toggleComplaintCategoryActive } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(CATEGORY_EMPTY);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    if (!form.label.trim()) return;
    addComplaintCategory(form);
    setForm(CATEGORY_EMPTY);
    setOpen(false);
  };

  return (
    <div className="set-panel show">
      <div className="sec-head">
        <h2>Catégories de réclamation</h2>
        <button className="b b-cyan sp" onClick={() => setOpen((o) => !o)}>
          <Icon name="plus" />
          Ajouter une catégorie
        </button>
      </div>

      {open && (
        <div className="addform">
          <h4>Nouvelle catégorie</h4>
          <div className="form-grid">
            <div className="field">
              <label>Libellé</label>
              <input placeholder="ex. Dépôt sauvage" value={form.label} onChange={set('label')} />
            </div>
            <div className="field">
              <label>Icône (emoji)</label>
              <input placeholder="🗑️" value={form.icon} onChange={set('icon')} />
            </div>
            <div className="field">
              <label>Priorité par défaut</label>
              <select value={form.defaultPriority} onChange={set('defaultPriority')}>
                <option>Haute</option>
                <option>Moyenne</option>
                <option>Basse</option>
              </select>
            </div>
            <div className="field">
              <label>Délai cible (heures)</label>
              <input type="number" value={form.slaHours} onChange={set('slaHours')} />
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
              <th>Libellé</th>
              <th>Icône</th>
              <th>Priorité par défaut</th>
              <th>Délai cible (SLA)</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {complaintCategories.map((c) => (
              <tr key={c.id}>
                <td>{c.label}</td>
                <td>{c.icon}</td>
                <td>
                  <span className={`prio p-${c.defaultPriority.toLowerCase()}`}>{c.defaultPriority}</span>
                </td>
                <td className="mono">{c.slaHours} h</td>
                <td>
                  <span className={`chip ${c.isActive ? 'c-on' : 'c-off'}`}>{c.isActive ? 'Actif' : 'Inactif'}</span>
                </td>
                <td>
                  <span
                    className="row-act"
                    onClick={() => toggleComplaintCategoryActive(c.id, !c.isActive)}
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

/* --- Utilisateurs & rôles --- */
const USER_EMPTY = { email: '', fullName: '', password: '', role: 'Superviseur', scope: '', cityId: '' };
const ROLES = ['Administrateur', 'Superviseur', 'Agent traitement', 'Exploitant flotte'];

export function UsersTab() {
  const { users, addUser, toggleUserActive } = useApp();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(USER_EMPTY);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!user?.isSuperAdmin) return;
    tenancyApi.getCities().then(setCities).catch(() => setCities([]));
  }, [user?.isSuperAdmin]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    if (!form.email.trim() || !form.fullName.trim() || !form.password.trim()) return;
    addUser(form);
    setForm(USER_EMPTY);
    setOpen(false);
  };

  return (
    <div className="set-panel show">
      <div className="sec-head">
        <h2>Utilisateurs &amp; rôles</h2>
        <button className="b b-cyan sp" onClick={() => setOpen((o) => !o)}>
          <Icon name="plus" />
          Inviter un utilisateur
        </button>
      </div>

      {open && (
        <div className="addform">
          <h4>Nouvel utilisateur</h4>
          <div className="form-grid">
            <div className="field">
              <label>Nom complet</label>
              <input value={form.fullName} onChange={set('fullName')} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set('email')} />
            </div>
            <div className="field">
              <label>Mot de passe initial</label>
              <input type="password" value={form.password} onChange={set('password')} />
            </div>
            <div className="field">
              <label>Rôle</label>
              <select value={form.role} onChange={set('role')}>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Périmètre</label>
              <input placeholder="ex. Anfa · Maârif" value={form.scope} onChange={set('scope')} />
            </div>
            {user?.isSuperAdmin && (
              <div className="field">
                <label>Ville</label>
                <select value={form.cityId} onChange={set('cityId')}>
                  <option value="">Aucune (SuperAdmin)</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
              <th>Email</th>
              <th>Rôle</th>
              <th>Périmètre</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td className="mono">{u.email}</td>
                <td>{u.roles?.join(', ')}</td>
                <td>{u.scope || '—'}</td>
                <td>
                  <span className={`chip ${u.isActive ? 'c-on' : 'c-off'}`}>{u.isActive ? 'Actif' : 'Inactif'}</span>
                </td>
                <td>
                  <span className="row-act" onClick={() => toggleUserActive(u.id, !u.isActive)} role="button" tabIndex={0}>
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
