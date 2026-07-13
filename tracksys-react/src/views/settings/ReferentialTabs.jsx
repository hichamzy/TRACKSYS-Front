import Icon from '../../components/icons/Icon.jsx';
import Panel from '../../components/ui/Panel.jsx';
import RuleList from '../alerts/RuleList.jsx';
import ChannelList from '../alerts/ChannelList.jsx';
import { DRIVERS, COMPLAINT_CATEGORIES, USERS } from '../../data/referentials.js';
import { useApp } from '../../context/AppContext.jsx';

function RowAction({ label }) {
  const { showToast } = useApp();
  return (
    <span className="row-act" role="button" tabIndex={0} onClick={() => showToast(label)}>
      ⋯
    </span>
  );
}

/* --- Chauffeurs --- */
export function DriversTab() {
  const { showToast } = useApp();
  return (
    <div className="set-panel show">
      <div className="sec-head">
        <h2>Référentiel chauffeurs</h2>
        <button className="b b-cyan sp" onClick={() => showToast('Formulaire chauffeur (maquette)')}>
          <Icon name="plus" />
          Ajouter un chauffeur
        </button>
      </div>

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
            {DRIVERS.map((d) => (
              <tr key={d.name}>
                <td>{d.name}</td>
                <td className="mono">{d.phone}</td>
                <td className="mono">{d.licence}</td>
                <td className="mono">{d.vehicle}</td>
                <td>
                  <span className={`chip ${d.chip}`}>{d.status}</span>
                </td>
                <td>
                  <RowAction label={`Actions ${d.name} (maquette)`} />
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
export function CategoriesTab() {
  const { showToast } = useApp();
  return (
    <div className="set-panel show">
      <div className="sec-head">
        <h2>Catégories de réclamation</h2>
        <button className="b b-cyan sp" onClick={() => showToast('Formulaire catégorie (maquette)')}>
          <Icon name="plus" />
          Ajouter une catégorie
        </button>
      </div>

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
            {COMPLAINT_CATEGORIES.map((c) => (
              <tr key={c.label}>
                <td>{c.label}</td>
                <td>{c.icon}</td>
                <td>
                  <span className={`prio p-${c.prio.toLowerCase()}`}>{c.prio}</span>
                </td>
                <td className="mono">{c.sla}</td>
                <td>
                  <span className={`chip ${c.active ? 'c-on' : 'c-off'}`}>{c.active ? 'Actif' : 'Inactif'}</span>
                </td>
                <td>
                  <RowAction label={`Actions ${c.label} (maquette)`} />
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
export function UsersTab() {
  const { showToast } = useApp();
  return (
    <div className="set-panel show">
      <div className="sec-head">
        <h2>Utilisateurs &amp; rôles</h2>
        <button className="b b-cyan sp" onClick={() => showToast('Formulaire utilisateur (maquette)')}>
          <Icon name="plus" />
          Inviter un utilisateur
        </button>
      </div>

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
            {USERS.map((u) => (
              <tr key={u.email}>
                <td>{u.name}</td>
                <td className="mono">{u.email}</td>
                <td>{u.role}</td>
                <td>{u.scope}</td>
                <td>
                  <span className={`chip ${u.active ? 'c-on' : 'c-off'}`}>{u.active ? 'Actif' : 'Inactif'}</span>
                </td>
                <td>
                  <RowAction label={`Actions ${u.name} (maquette)`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
