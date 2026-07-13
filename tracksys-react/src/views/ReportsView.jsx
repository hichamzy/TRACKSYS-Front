import { useState } from 'react';
import Icon from '../components/icons/Icon.jsx';
import KpiCard from '../components/ui/KpiCard.jsx';
import Panel from '../components/ui/Panel.jsx';
import BarChart from '../components/charts/BarChart.jsx';
import LineChart from '../components/charts/LineChart.jsx';
import { useApp } from '../context/AppContext.jsx';
import { exportCSV } from '../utils/csv.js';
import {
  MONTHS,
  DIST_DATA,
  RESO_DATA,
  SAVED_REPORTS,
  REPORT_TYPES,
  REPORT_PERIODS,
  REPORT_DETAILS,
  REPORT_KPIS,
} from '../data/reports.js';

export default function ReportsView() {
  const { showToast } = useApp();

  const [type, setType] = useState(REPORT_TYPES[0]);
  const [period, setPeriod] = useState(REPORT_PERIODS[0]);
  const [detail, setDetail] = useState(REPORT_DETAILS[0]);

  const exportReport = (name) => {
    const rows = [
      [`TRACKSYS · Rapport ${name || type}`],
      ['Période', period],
      [],
      ['Mois', 'Distance flotte (km)', 'Taux de résolution (%)'],
    ];
    MONTHS.forEach((m, i) => rows.push([`${m} 2026`, DIST_DATA[i], RESO_DATA[i]]));
    exportCSV('rapport-tracksys.csv', rows);
    showToast('Fichier rapport-tracksys.csv téléchargé');
  };

  return (
    <section className="view show">
      <Panel title="Générateur de rapport" tag="export Excel / PDF" style={{ marginBottom: 20 }} bodyStyle={{ padding: 18 }}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="r-type">Type de rapport</label>
            <select id="r-type" value={type} onChange={(e) => setType(e.target.value)}>
              {REPORT_TYPES.map((o) => (
                <option key={o}>{o}</option>
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
          <button className="b b-cyan" onClick={() => showToast('Aperçu du rapport généré')}>
            <Icon name="eye" />
            Générer l'aperçu
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
        {REPORT_KPIS.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="chart-card">
          <div className="chart-title">Distance parcourue par la flotte</div>
          <div className="chart-sub">Kilomètres cumulés · 12 derniers mois</div>
          <BarChart />
        </div>

        <div className="chart-card">
          <div className="chart-title">Taux de résolution des réclamations</div>
          <div className="chart-sub">Pourcentage résolu sous 48 h · 12 derniers mois</div>
          <LineChart />
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
            {SAVED_REPORTS.map((r) => {
              const pdf = r.format === 'PDF';
              return (
                <tr key={r.name}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{r.period}</td>
                  <td className="mono">{r.date}</td>
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
