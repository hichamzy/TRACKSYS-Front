import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../components/icons/Icon.jsx';
import KpiCard from '../components/ui/KpiCard.jsx';
import HistoryMap from '../components/map/HistoryMap.jsx';
import TripPlayer from './history/TripPlayer.jsx';
import StopList from './history/StopList.jsx';
import { useApp } from '../context/AppContext.jsx';
import { positionsApi } from '../api/endpoints/positionsApi.js';
import { mapTripHistory } from '../utils/mapTripHistory.js';
import { exportCSV } from '../utils/csv.js';
import { parseHM, fmtMin } from '../utils/geo.js';

// Durée de la relecture complète en 1× (ms)
const PLAY_DURATION_MS = 22000;

export default function HistoryView() {
  const { showToast, histVehicle, setHistVehicle, vehicles } = useApp();

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [trip, setTrip] = useState({ route: [], stops: [], startMin: 0, durMin: 0 });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const rafRef = useRef(null);
  const lastTs = useRef(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const endMin = trip.startMin + trip.durMin;

  const loadTrip = useCallback(async () => {
    const vehicle = vehicles.find((v) => v.id === histVehicle);
    if (!vehicle?.flespiIdent) {
      showToast('Ce véhicule n’a pas de balise GPS associée');
      setTrip({ route: [], stops: [], startMin: 0, durMin: 0 });
      return;
    }
    setLoading(true);
    try {
      const fromUtc = new Date(`${date}T00:00:00.000Z`).toISOString();
      const toUtc = new Date(`${date}T23:59:59.999Z`).toISOString();
      const positions = await positionsApi.getHistory(vehicle.flespiIdent, fromUtc, toUtc);
      const next = mapTripHistory(positions);
      setTrip(next);
      setProgress(0);
      setPlaying(false);
      if (!positions.length) showToast('Aucun trajet trouvé pour cette date');
      else showToast(`Trajet du ${date} chargé`);
    } catch {
      showToast('Échec du chargement du trajet');
    } finally {
      setLoading(false);
    }
  }, [vehicles, histVehicle, date, showToast]);

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [histVehicle]);

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
    const cur = trip.startMin + progress * trip.durMin;
    let act = -1;
    trip.stops.forEach((s, i) => {
      if (parseHM(s.t) <= cur) act = i;
    });
    return act;
  }, [progress, trip]);

  const kpis = useMemo(() => {
    if (!trip.route.length) return [];
    return [
      { icon: 'clock', tone: 'kc', value: fmtMin(trip.durMin), label: 'Durée de service' },
      { icon: 'flag', tone: 'kg', value: fmtMin(trip.startMin), label: 'Départ' },
      { icon: 'pin', tone: 'ko', cit: true, value: fmtMin(endMin), label: 'Arrivée' },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip]);

  const exportHist = () => {
    const rows = [
      ['TRACKSYS · Historique trajet', histVehicle, date],
      [],
      ['#', 'Heure', 'Point'],
    ];
    trip.stops.forEach((s, i) =>
      rows.push([s.type === 'start' ? 'Départ' : s.type === 'end' ? 'Arrivée' : i, s.t, s.n])
    );
    exportCSV(`historique-${histVehicle}-${date}.csv`, rows);
    showToast(`Fichier historique-${histVehicle}-${date}.csv téléchargé`);
  };

  return (
    <section className="view show">
      <div className="hist-controls" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
        <div className="field">
          <label htmlFor="h-veh">Véhicule</label>
          <select id="h-veh" value={histVehicle} onChange={(e) => setHistVehicle(e.target.value)}>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} · {v.plate} {v.driver ? `(${v.driver})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="h-date">Date</label>
          <input id="h-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <button className="b b-cyan" onClick={loadTrip} disabled={loading}>
          <Icon name="searchAlt" />
          {loading ? 'Chargement…' : 'Afficher le trajet'}
        </button>
      </div>

      <div className="kpi-row" style={{ marginBottom: 16 }}>
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="hist-grid">
        <div>
          <div className="mapwrap" style={{ height: 440 }}>
            <HistoryMap route={trip.route} stops={trip.stops} progress={progress} vehicleId={histVehicle} />
            <div className="live-chip" style={{ background: 'rgba(34,18,56,.9)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              TRAJET RÉALISÉ · {date}
            </div>
          </div>

          <TripPlayer
            progress={progress}
            playing={playing}
            speed={speed}
            startMin={trip.startMin}
            durMin={trip.durMin}
            endMin={endMin}
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

          <StopList stops={trip.stops} activeIndex={activeIndex} />

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
