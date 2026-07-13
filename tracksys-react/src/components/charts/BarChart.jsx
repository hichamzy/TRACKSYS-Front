import { MONTHS, DIST_DATA } from '../../data/reports.js';

const W = 560;
const H = 220;
const PAD = 30;
const MAX = 12000;
const BW = 32;
const GAP = (W - PAD * 2 - BW * 12) / 11;

/** Distance parcourue par la flotte — barres animées à l'affichage */
export default function BarChart() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {[0, 3000, 6000, 9000, 12000].map((g) => {
        const y = H - PAD - (g / MAX) * (H - PAD * 2);
        return (
          <g key={g}>
            <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#EEF2F8" strokeWidth={1} />
            <text x={0} y={y + 3} fontSize={9} fill="#98A2B3" fontFamily="IBM Plex Mono">
              {g / 1000}k
            </text>
          </g>
        );
      })}

      {DIST_DATA.map((d, i) => {
        const x = PAD + i * (BW + GAP);
        const h = (d / MAX) * (H - PAD * 2);
        const y = H - PAD - h;
        const last = i === 11;
        return (
          <g key={MONTHS[i]}>
            <rect x={x} y={H - PAD} width={BW} height={0} rx={4} fill={last ? '#189AB6' : '#22B2CE'} opacity={last ? 1 : 0.75}>
              <animate attributeName="height" from={0} to={h} dur="0.7s" fill="freeze" begin={`${i * 0.04}s`} />
              <animate attributeName="y" from={H - PAD} to={y} dur="0.7s" fill="freeze" begin={`${i * 0.04}s`} />
            </rect>
            <text x={x + BW / 2} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill="#98A2B3" fontFamily="IBM Plex Mono">
              {MONTHS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
