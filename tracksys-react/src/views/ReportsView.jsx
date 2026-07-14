import { useCallback, useState } from 'react';
import Icon from '../components/icons/Icon.jsx';
import KpiCard from '../components/ui/KpiCard.jsx';
import Panel from '../components/ui/Panel.jsx';
import BarChart from '../components/charts/BarChart.jsx';
import LineChart from '../components/charts/LineChart.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useResource } from '../hooks/useResource.js';
import { reportsApi } from '../api/endpoints/reportsApi.js';
import { exportCSV } from '../utils/csv.js';
import { shortMonthLabel } from '../utils/monthLabel.js';
import { REPORT_PERIODS, REPORT_DETAILS } from '../data/reports.js';

export default function ReportsView() {
  const { showToast } = useApp();

  const { data: kpis } = useResource(useCallback(() => reportsApi.getKpis(), []), { initialData: null });
  const { data: distanceSeries } = useResource(useCallback(() => reportsApi.getDistanceSeries(), []), { initialData: [] });
  const { data: resolutionSeries } = useResource(useCallback(() => reportsApi.getResolutionSeries(), []), { initialData: [] });
  const { data: reportTypes } = useResource(useCallback(() => reportsApi.getTypes(), []), { initialData: [] });
  const { data: savedReports, refetch: refetchSaved } = useResource(useCallback(() => reportsApi.getSaved(), []), {
    initialData: [],
  });

  const [type, setType] = useState('');
  const [period, setPeriod] = useState(REPORT_PERIODS[0]);
  const [detail, setDetail] = useState(REPORT_DETAILS[0]);

  const months = distanceSeries.map((p) => shortMonthLabel(p.yearMonth));
  const distValues = distanceSeries.map((p) => p.value);
  const resoValues = resolutionSeries.map((p) => p.value);

  const exportReport = (name) => {
    const rows = [
      [`TRACKSYS · Rapport ${name || type || reportTypes[0]?.label || ''}`],
      ['Période', period],
      [],
      ['Mois', 'Distance flotte (km)', 'Taux de résolution (%)'],
    ];
    distanceSeries.forEach((p, i) => rows.push([p.yearMonth, distValues[i], resoValues[i]]));
    exportCSV('rapport-tracksys.csv', rows);
    showToast('Fichier rapport-tracksys.csv téléchargé');
  };

  const saveReport = async () => {
    const reportType = reportTypes.find((t) => t.label === type) ?? reportTypes[0];
    if (!reportType) return;
    try {
      await reportsApi.saveReport({ reportTypeId: reportType.id, name: reportType.label, periodLabel: period, format: 'XLSX' });
      await refetchSaved();
      showToast('Rapport enregistré');
    } catch {
      showToast('Échec de l’enregistrement du rapport');
    }
  };

  const kpiCards = kpis
    ? [
        { icon: 'gauge', tone: 'kn', value: kpis.fleetDistanceTodayKm.toLocaleString('fr-FR'), unit: ' km', label: 'Distance flotte (aujourd’hui)' },
        { icon: 'complaint', tone: 'ko', cit: true, value: kpis.resolvedComplaintsCount, label: 'Réclamations résolues' },
        { icon: 'chat', tone: 'kc', value: kpis.totalComplaintsCount, label: 'Réclamations au total' },
        { icon: 'bell', tone: 'kg', value: kpis.alertsCount, label: 'Alertes enregistrées' },
      ]
    : [];

  return (
    <section className="view show">
      <Panel title="Générateur de rapport" tag="export Excel / PDF" style={{ marginBottom: 20 }} bodyStyle={{ padding: 18 }}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="r-type">Type de rapport</label>
            <select id="r-type" value={type || reportTypes[0]?.label || ''} onChange={(e) => setType(e.target.value)}>
              {reportTypes.map((o) => (
                <option key={o.id}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="r-period">Période</label>
            <select id="r-period" value={period} onChange={(e) => setPeriod(e.target.value)}>
              {REPORT_PERIODS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="r-zone">Niveau de détail</label>
            <select id="r-zone" value={detail} onChange={(e) => setDetail(e.target.value)}>
              {REPORT_DETAILS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="btn-row">
          <button className="b b-cyan" onClick={saveReport}>
            <Icon name="eye" />
            Générer et enregistrer
          </button>
          <button className="b b-excel" onClick={() => exportReport()}>
            <Icon name="excel" />
            Télécharger Excel
          </button>
          <button className="b b-pdf" onClick={() => window.print()}>
            <Icon name="printer" />
            Télécharger PDF
          </button>
        </div>
      </Panel>

      <div className="kpi-row">
        {kpiCards.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="chart-card">
          <div className="chart-title">Distance parcourue par la flotte</div>
          <div className="chart-sub">Kilomètres cumulés · 12 derniers mois</div>
          {months.length > 0 && <BarChart months={months} data={distValues} />}
        </div>

        <div className="chart-card">
          <div className="chart-title">Taux de résolution des réclamations</div>
          <div className="chart-sub">Pourcentage résolu sous 48 h · 12 derniers mois</div>
          {months.length > 0 && <LineChart months={months} data={resoValues} />}
        </div>
      </div>

      <Panel title="Rapports enregistrés" tag="téléchargement direct">
        <table className="tbl">
          <thead>
            <tr>
              <th>Rapport</th>
              <th>Période</th>
              <th>Généré le</th>
              <th>Format</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {savedReports.map((r) => {
              const pdf = r.format === 'PDF';
              return (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{r.periodLabel}</td>
                  <td className="mono">{new Date(r.generatedAtUtc).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className={`chip ${pdf ? 'c-idle' : 'c-on'}`}>{r.format}</span>
                  </td>
                  <td>
                    <button
                      className={`b ${pdf ? 'b-pdf' : 'b-excel'}`}
                      style={{ padding: '7px 13px' }}
                      onClick={() => (pdf ? window.print() : exportReport(r.name))}
                    >
                      <Icon name="download" />
                      Télécharger
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </section>
  );
}
