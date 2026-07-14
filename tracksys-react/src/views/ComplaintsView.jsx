import { useMemo, useState } from 'react';
import Icon from '../components/icons/Icon.jsx';
import KpiCard from '../components/ui/KpiCard.jsx';
import Segmented from '../components/ui/Segmented.jsx';
import { useApp } from '../context/AppContext.jsx';
import { exportCSV } from '../utils/csv.js';
import { avantImg } from '../utils/photos.js';
import { STATUS_CHIP, STATUS_ORDER } from '../data/complaints.js';

export default function ComplaintsView() {
  const { complaints, complaintCategories, setOpenComplaintId, showToast } = useApp();

  const [status, setStatus] = useState('all');
  const [cat, setCat] = useState('all');

  const categoryOptions = [
    { value: 'all', label: 'Toutes les catégories' },
    ...complaintCategories.map((c) => ({ value: c.label, label: c.label })),
  ];

  const byCat = useMemo(() => complaints.filter((c) => cat === 'all' || c.type === cat), [complaints, cat]);

  const counts = useMemo(() => {
    const m = { all: byCat.length };
    STATUS_ORDER.forEach((s) => {
      m[s] = byCat.filter((c) => c.status === s).length;
    });
    return m;
  }, [byCat]);

  const list = useMemo(
    () => byCat.filter((c) => status === 'all' || c.status === status),
    [byCat, status]
  );

  const segOptions = [{ key: 'all', label: 'Toutes' }, ...STATUS_ORDER.map((s) => ({ key: s, label: s }))];

  const resolvedCount = complaints.filter((c) => c.status === 'Résolue').length;
  const pendingCount = complaints.filter((c) => c.status === 'Reçue').length;

  const exportComplaints = () => {
    const rows = [['ID', 'Type', 'Adresse', 'Priorité', 'Statut', 'Signalée le']];
    complaints.forEach((c) => rows.push([c.id, c.type, c.zone, c.prio, c.status, c.date]));
    exportCSV('reclamations-citoyennes.csv', rows);
    showToast('Fichier reclamations-citoyennes.csv téléchargé');
  };

  return (
    <section className="view show">
      <div className="kpi-row">
        <KpiCard icon="clipboardCheck" tone="kg" value={resolvedCount} label="Résolues" />
        <KpiCard icon="warning" tone="ko" cit value={pendingCount} label="En attente d'assignation" />
      </div>

      <div className="rc-toolbar">
        <Segmented options={segOptions} counts={counts} active={status} onChange={setStatus} />

        <select className="rc-cat" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrer par catégorie">
          {categoryOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button className="b b-excel" onClick={exportComplaints}>
          <Icon name="excel" />
          Exporter Excel
        </button>
      </div>

      <div className="panel">
        <table className="tbl rc-table">
          <thead>
            <tr>
              <th>Réclamation</th>
              <th>Adresse</th>
              <th>Priorité</th>
              <th>Statut</th>
              <th>Signalée</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="rc-empty">Aucune réclamation pour ce filtre.</div>
                </td>
              </tr>
            )}

            {list.map((c) => (
              <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => setOpenComplaintId(c.id)}>
                <td>
                  <div className="rc-cell">
                    <div className="rc-thumb" style={{ backgroundImage: `url('${avantImg(c.type)}')` }} />
                    <div>
                      <div className="t">{c.type}</div>
                      <div className="i">{c.id}</div>
                    </div>
                  </div>
                </td>
                <td>{c.zone}</td>
                <td>
                  <span className={`prio p-${c.prio.toLowerCase()}`}>{c.prio}</span>
                </td>
                <td>
                  <span className={`st-chip ${STATUS_CHIP[c.status]}`}>{c.status}</span>
                </td>
                <td className="mono" style={{ fontSize: 11.5 }}>
                  {c.date}
                </td>
                <td>
                  <Icon name="chevronRight" size={16} style={{ color: '#98A2B3' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
