const W = 560;
const H = 220;
const PAD = 30;

/** Taux de résolution des réclamations — courbe animée (tracé progressif) */
export default function LineChart({ months, data }) {
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 1);
  const span = max - min || 1;
  const step = (W - PAD * 2) / Math.max(1, data.length - 1);
  const pts = data.map((d, i) => [PAD + i * step, H - PAD - ((d - min) / span) * (H - PAD * 2)]);
  const last = pts.length - 1;
  const area = pts.length
    ? 'M' + pts.map((p) => p.join(',')).join(' L') + ` L${pts[last][0]},${H - PAD} L${pts[0][0]},${H - PAD} Z`
    : '';

  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(min + span * f));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {gridValues.map((g) => {
        const y = H - PAD - ((g - min) / span) * (H - PAD * 2);
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
        <g key={months[i]}>
          <circle cx={p[0]} cy={p[1]} r={i === last ? 4 : 2.5} fill="#fff" stroke="#2BB673" strokeWidth={2} />
          <text x={p[0]} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill="#98A2B3" fontFamily="IBM Plex Mono">
            {months[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
