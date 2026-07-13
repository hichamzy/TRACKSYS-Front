import { MONTHS, RESO_DATA } from '../../data/reports.js';

const W = 560;
const H = 220;
const PAD = 30;
const MIN = 60;
const MAX = 100;

/** Taux de résolution des réclamations — courbe animée (tracé progressif) */
export default function LineChart() {
  const step = (W - PAD * 2) / 11;
  const pts = RESO_DATA.map((d, i) => [PAD + i * step, H - PAD - ((d - MIN) / (MAX - MIN)) * (H - PAD * 2)]);
  const area = 'M' + pts.map((p) => p.join(',')).join(' L') + ` L${pts[11][0]},${H - PAD} L${pts[0][0]},${H - PAD} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {[60, 70, 80, 90, 100].map((g) => {
        const y = H - PAD - ((g - MIN) / (MAX - MIN)) * (H - PAD * 2);
        return (
          <g key={g}>
            <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#EEF2F8" strokeWidth={1} />
            <text x={2} y={y + 3} fontSize={9} fill="#98A2B3" fontFamily="IBM Plex Mono">
              {g}%
            </text>
          </g>
        );
      })}

      <path d={area} fill="rgba(43,182,115,.10)" />

      <polyline
        points={pts.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="#2BB673"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="1400"
        strokeDashoffset="1400"
      >
        <animate attributeName="stroke-dashoffset" from="1400" to="0" dur="1.4s" fill="freeze" />
      </polyline>

      {pts.map((p, i) => (
        <g key={MONTHS[i]}>
          <circle cx={p[0]} cy={p[1]} r={i === 11 ? 4 : 2.5} fill="#fff" stroke="#2BB673" strokeWidth={2} />
          <text x={p[0]} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill="#98A2B3" fontFamily="IBM Plex Mono">
            {MONTHS[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
