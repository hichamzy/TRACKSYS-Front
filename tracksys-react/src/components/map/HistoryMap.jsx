import { useMemo } from 'react';
import MapBase from './MapBase.jsx';
import { HIST_ROUTE, HIST_STOPS } from '../../data/history.js';
import { measureRoute, pointAt, toPoints } from '../../utils/geo.js';

/**
 * Carte de l'historique : tracé du parcours, arrêts numérotés (D = départ, A = arrivée)
 * et marqueur du véhicule positionné selon la progression `progress` (0 → 1).
 */
export default function HistoryMap({ progress = 0, vehicleId = 'BN-04' }) {
  const { segLen, total } = useMemo(() => measureRoute(HIST_ROUTE), []);
  const points = useMemo(() => toPoints(HIST_ROUTE), []);
  const [mx, my] = pointAt(HIST_ROUTE, segLen, total, progress);

  return (
    <svg className="map-svg" viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid slice">
      <MapBase />

      <polyline points={points} fill="none" stroke="rgba(34,178,206,.32)" strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={points} fill="none" stroke="#22B2CE" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />

      {HIST_STOPS.map((s, i) => {
        const col = s.type ? '#2BB673' : '#1B3A6B';
        const mark = s.type === 'start' ? 'D' : s.type === 'end' ? 'A' : i;
        return (
          <g key={`${s.t}-${i}`}>
            <circle cx={s.x} cy={s.y} r={9} fill="#fff" stroke={col} strokeWidth={3} />
            <text x={s.x} y={s.y + 3.5} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="IBM Plex Mono" fill={col}>
              {mark}
            </text>
          </g>
        );
      })}

      <g transform={`translate(${mx},${my})`}>
        <circle cx={0} cy={0} r={15} fill="rgba(34,178,206,.18)" />
        <circle cx={0} cy={0} r={11} fill="#fff" />
        <circle cx={0} cy={0} r={7.5} fill="#22B2CE" />
        <text x={0} y={-17} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="IBM Plex Mono" fill="#221238">
          {vehicleId}
        </text>
      </g>
    </svg>
  );
}
