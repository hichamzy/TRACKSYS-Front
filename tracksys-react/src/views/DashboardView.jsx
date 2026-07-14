import { useCallback } from 'react';
import KpiCard from '../components/ui/KpiCard.jsx';
import Panel from '../components/ui/Panel.jsx';
import { LIVE_FEED } from '../data/complaints.js';
import { useApp } from '../context/AppContext.jsx';
import { useResource } from '../hooks/useResource.js';
import { citizenApi } from '../api/endpoints/citizenApi.js';
import { reportsApi } from '../api/endpoints/reportsApi.js';

export default function DashboardView() {
  const { vehicles, openComplaints } = useApp();

  const { data: breakdown } = useResource(useCallback(() => citizenApi.getComplaintCategoryBreakdown(), []), {
    initialData: [],
  });
  const { data: kpis } = useResource(useCallback(() => reportsApi.getKpis(), []), { initialData: null });

  const activeCount = vehicles.filter((v) => v.status === 'active').length;
  const resolutionRate = kpis && kpis.totalComplaintsCount > 0
    ? Math.round((100 * kpis.resolvedComplaintsCount) / kpis.totalComplaintsCount)
    : 0;

  const kpiCards = [
    { icon: 'truck', tone: 'kc', value: `${activeCount}`, unit: ` / ${vehicles.length}`, label: 'Véhicules actifs' },
    { icon: 'gauge', tone: 'kn', value: kpis ? kpis.fleetDistanceTodayKm.toLocaleString('fr-FR') : '—', unit: ' km', label: "Distance aujourd'hui" },
    { icon: 'chat', tone: 'ko', cit: true, value: `${openComplaints.length}`, label: 'Réclamations ouvertes' },
    { icon: 'checkCircle', tone: 'kg', value: `${resolutionRate}`, unit: '%', label: 'Taux de résolution' },
  ];

  return (
    <section className="view show">
      <div className="kpi-row">
        {kpiCards.map((k) => (
          <KpiCard key={k.label} {...k} />
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

        <Panel title="Réclamations par catégorie" tag="toutes réclamations" bodyStyle={{ padding: '6px 0 10px' }}>
          {breakdown.map((z) => (
            <div className="zone-row" key={z.categoryId}>
              <span className="zone-name">{z.categoryLabel}</span>
              <div className="bar">
                <span style={{ width: `${z.percentage}%` }} />
              </div>
              <span className="zone-val">{z.count}</span>
            </div>
          ))}
        </Panel>
      </div>
    </section>
  );
}
