import { useMemo, useState } from 'react';
import Icon from '../components/icons/Icon.jsx';
import KpiCard from '../components/ui/KpiCard.jsx';
import Panel from '../components/ui/Panel.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import Segmented from '../components/ui/Segmented.jsx';
import AlertList from './alerts/AlertList.jsx';
import RuleList from './alerts/RuleList.jsx';
import ChannelList from './alerts/ChannelList.jsx';
import { useApp } from '../context/AppContext.jsx';
import { exportCSV, plainDetail } from '../utils/csv.js';
import { ALERT_TYPES, SEV_LABEL, SEV_FILTERS, ALERT_VEHICLE_OPTIONS } from '../data/alerts.jsx';
import { NOTIF_RECIPIENTS, NOTIF_FREQUENCIES } from '../data/referentials.js';

const TABS = [
  { key: 'feed', label: 'Alertes reçues', icon: 'bellOpen' },
  { key: 'rules', label: 'Règles & seuils', icon: 'sliders' },
];

export default function AlertsView() {
  const { alerts, rules, unreadCount, markAllRead, showToast } = useApp();

  const [tab, setTab] = useState('feed');
  const [sev, setSev] = useState('all');
  const [veh, setVeh] = useState('all');

  const byVehicle = useMemo(() => alerts.filter((a) => veh === 'all' || a.veh === veh), [alerts, veh]);

  const counts = useMemo(
    () => ({
      all: byVehicle.length,
      hi: byVehicle.filter((a) => ALERT_TYPES[a.k].sev === 'hi').length,
      md: byVehicle.filter((a) => ALERT_TYPES[a.k].sev === 'md').length,
      lo: byVehicle.filter((a) => ALERT_TYPES[a.k].sev === 'lo').length,
    }),
    [byVehicle]
  );

  const list = useMemo(
    () => byVehicle.filter((a) => sev === 'all' || ALERT_TYPES[a.k].sev === sev),
    [byVehicle, sev]
  );

  const activeRules = rules.filter((r) => r.on).length;

  const exportAlerts = () => {
    const rows = [['ID', 'Type', 'Gravité', 'Véhicule', 'Détail', 'Quand']];
    alerts.forEach((a) => {
      const t = ALERT_TYPES[a.k];
      rows.push([a.id, t.label, SEV_LABEL[t.sev], a.veh, plainDetail(a.det), a.time]);
    });
    exportCSV('alertes-tracksys.csv', rows);
    showToast('Fichier alertes-tracksys.csv téléchargé');
  };

  return (
    <section className="view show">
      <div className="kpi-row">
        <KpiCard icon="warning" tone="ko" value={unreadCount} label="Alertes non lues" />
        <KpiCard icon="zap" tone="kc" value="12" label="Excès de vitesse (7 j)" />
        <KpiCard icon="clock" tone="kn" value="9" label="Arrêts prolongés (7 j)" />
        <KpiCard icon="checkCircle" tone="kg" value={activeRules} label="Règles actives" />
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'feed' && (
        <div className="set-panel show">
          <div className="rc-toolbar">
            <Segmented options={SEV_FILTERS} counts={counts} active={sev} onChange={setSev} />

            <select className="rc-cat" value={veh} onChange={(e) => setVeh(e.target.value)} aria-label="Filtrer par véhicule">
              {ALERT_VEHICLE_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v === 'all' ? 'Tous les véhicules' : v}
                </option>
              ))}
            </select>

            <button className="b" onClick={markAllRead}>
              <Icon name="check" />
              Tout marquer comme lu
            </button>

            <button className="b b-excel" onClick={exportAlerts}>
              <Icon name="excel" />
              Exporter Excel
            </button>
          </div>

          <div className="panel">
            <AlertList alerts={list} />
          </div>
        </div>
      )}

      {tab === 'rules' && (
        <div className="set-panel show">
          <Panel title="Règles de déclenchement" tag="seuils configurables">
            <RuleList />
          </Panel>

          <Panel title="Canaux de notification" style={{ marginTop: 16 }} bodyStyle={{ padding: 18 }}>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="field">
                <label>Destinataires</label>
                <select defaultValue={NOTIF_RECIPIENTS[0]}>
                  {NOTIF_RECIPIENTS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Fréquence de récapitulatif</label>
                <select defaultValue={NOTIF_FREQUENCIES[0]}>
                  {NOTIF_FREQUENCIES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="b b-cyan"
              style={{ marginTop: 16 }}
              onClick={() => showToast('Paramètres de notification enregistrés')}
            >
              <Icon name="check" />
              Enregistrer
            </button>
          </Panel>
        </div>
      )}
    </section>
  );
}
