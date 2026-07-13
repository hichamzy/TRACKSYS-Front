import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../components/icons/Icon.jsx';
import KpiCard from '../components/ui/KpiCard.jsx';
import HistoryMap from '../components/map/HistoryMap.jsx';
import TripPlayer from './history/TripPlayer.jsx';
import StopList from './history/StopList.jsx';
import { useApp } from '../context/AppContext.jsx';
import { exportCSV } from '../utils/csv.js';
import { parseHM } from '../utils/geo.js';
import {
  HIST_STOPS,
  HIST_KPIS,
  HIST_VEHICLE_OPTIONS,
  START_MIN,
  DUR_MIN,
  PLAY_DURATION_MS,
} from '../data/history.js';

export default function HistoryView() {
  const { showToast, histVehicle, setHistVehicle } = useApp();

  const [date, setDate] = useState('2026-07-06');
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const rafRef = useRef(null);
  const lastTs = useRef(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Boucle de lecture — équivalent du requestAnimationFrame de la maquette
  useEffect(() => {
    if (!playing) return undefined;

    lastTs.current = 0;
    const loop = (ts) => {
      if (!lastTs.current) lastTs.current = ts;
      const dt = ts - lastTs.current;
      lastTs.current = ts;

      setProgress((p) => {
        const next = p + (dt * speedRef.current) / PLAY_DURATION_MS;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const togglePlay = () => {
    setPlaying((p) => {
      const next = !p;
      if (next && progress >= 1) setProgress(0);
      return next;
    });
  };

  const scrubTo = (p) => {
    setPlaying(false);
    setProgress(p);
  };

  // Arrêt courant en fonction de l'heure simulée
  const activeIndex = useMemo(() => {
    const cur = START_MIN + progress * DUR_MIN;
    let act = -1;
    HIST_STOPS.forEach((s, i) => {
      if (parseHM(s.t) <= cur) act = i;
    });
    return act;
  }, [progress]);

  const exportHist = () => {
    const rows = [
      ['TRACKSYS · Historique trajet', histVehicle, '06/07/2026'],
      [],
      ['#', 'Heure', 'Point'],
    ];
    HIST_STOPS.forEach((s, i) =>
      rows.push([s.type === 'start' ? 'Départ' : s.type === 'end' ? 'Arrivée' : i, s.t, s.n])
    );
    exportCSV(`historique-${histVehicle}-06-07-2026.csv`, rows);
    showToast(`Fichier historique-${histVehicle}-06-07-2026.csv téléchargé`);
  };

  return (
    <section className="view show">
      <div className="hist-controls" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
        <div className="field">
          <label htmlFor="h-veh">Véhicule</label>
          <select id="h-veh" value={histVehicle} onChange={(e) => setHistVehicle(e.target.value)}>
            {HIST_VEHICLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="h-date">Date</label>
          <input id="h-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <button className="b b-cyan" onClick={() => showToast('Trajet du 06/07/2026 chargé')}>
          <Icon name="searchAlt" />
          Afficher le trajet
        </button>
      </div>

      <div className="kpi-row" style={{ marginBottom: 16 }}>
        {HIST_KPIS.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="hist-grid">
        <div>
          <div className="mapwrap" style={{ height: 440 }}>
            <HistoryMap progress={progress} vehicleId={histVehicle} />
            <div className="live-chip" style={{ background: 'rgba(34,18,56,.9)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              TRAJET RÉALISÉ · 06/07/2026
            </div>
          </div>

          <TripPlayer
            progress={progress}
            playing={playing}
            speed={speed}
            onToggle={togglePlay}
            onScrub={scrubTo}
            onSpeed={setSpeed}
          />
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column', maxHeight: 512 }}>
          <div className="panel-head">
            <h3>Chronologie</h3>
            <span className="tag">départ → arrivée</span>
          </div>

          <StopList activeIndex={activeIndex} />

          <div style={{ padding: 14, borderTop: '1px solid var(--line-2)' }}>
            <button className="b b-excel" style={{ width: '100%', justifyContent: 'center' }} onClick={exportHist}>
              <Icon name="excel" />
              Télécharger (Excel)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
