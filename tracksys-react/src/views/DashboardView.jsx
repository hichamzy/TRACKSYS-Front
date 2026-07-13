import KpiCard from '../components/ui/KpiCard.jsx';
import Panel from '../components/ui/Panel.jsx';
import { LIVE_FEED, CATEGORY_BREAKDOWN } from '../data/complaints.js';
import { useApp } from '../context/AppContext.jsx';

const KPIS = [
  { icon: 'truck', tone: 'kc', key: 'active', unit: ' / 16', label: 'Véhicules actifs', trend: { dir: 'up', text: '▲ 4%' } },
  { icon: 'gauge', tone: 'kn', value: '486', unit: ' km', label: "Distance aujourd'hui", trend: { dir: 'up', text: '▲ 12%' } },
  { icon: 'chat', tone: 'ko', cit: true, key: 'open', label: 'Réclamations ouvertes', trend: { dir: 'down', text: '▲ 6' } },
  { icon: 'checkCircle', tone: 'kg', value: '87', unit: '%', label: 'Taux de résolution (7 j)', trend: { dir: 'up', text: '▲ 3%' } },
];

export default function DashboardView() {
  const { vehicles, openComplaints } = useApp();

  // Les KPI reliés aux données vivantes restent cohérents avec le reste de l'application
  const dynamic = {
    active: `${vehicles.filter((v) => v.status === 'active').length}`,
    open: `${openComplaints.length}`,
  };

  return (
    <section className="view show">
      <div className="kpi-row">
        {KPIS.map((k) => (
          <KpiCard key={k.label} {...k} value={k.key ? dynamic[k.key] : k.value} />
        ))}
      </div>

      <div className="grid-2">
        <Panel title="Activité en direct" tag="flux temps réel">
          <div className="feed">
            {LIVE_FEED.map((f, i) => (
              <div className="feed-item" key={i}>
                <span className="feed-dot" style={{ background: f.color }} />
                <div className="feed-body">
                  <b>{f.title}</b>
                  {f.text}
                  <div className="feed-time">{f.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Réclamations par catégorie" tag="7 derniers jours" bodyStyle={{ padding: '6px 0 10px' }}>
          {CATEGORY_BREAKDOWN.map((z) => (
            <div className="zone-row" key={z.label}>
              <span className="zone-name">{z.label}</span>
              <div className="bar">
                <span style={{ width: `${z.pct}%` }} />
              </div>
              <span className="zone-val">{z.value}</span>
            </div>
          ))}
        </Panel>
      </div>
    </section>
  );
}
