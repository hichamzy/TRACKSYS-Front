// Fond de carte schématique (océan, îlots urbains, voirie) — repère 1000 x 720
const BLOCKS = [
  [70, 90, 180, 120], [300, 90, 150, 120], [510, 90, 180, 90], [760, 90, 170, 120],
  [70, 260, 180, 150], [300, 260, 150, 110], [520, 260, 120, 120], [720, 260, 90, 90], [860, 260, 80, 150],
  [70, 470, 170, 130], [300, 470, 180, 110], [540, 470, 150, 140], [760, 470, 180, 100],
];

const ROADS = [
  [0, 55, 1000, 55], [0, 235, 1000, 235], [0, 435, 1000, 435], [0, 620, 1000, 620],
  [55, 0, 55, 650], [275, 0, 275, 650], [480, 0, 480, 650], [695, 0, 695, 650], [840, 0, 840, 650],
];

export default function MapBase() {
  return (
    <g>
      <path d="M0 640 Q 220 600 420 660 T 1000 690 L1000 720 L0 720 Z" fill="#CBE4EC" />
      <text x={110} y={702} fill="#5f97a6" fontSize={12} fontFamily="IBM Plex Mono">
        OCÉAN ATLANTIQUE
      </text>

      {BLOCKS.map(([x, y, w, h], i) => (
        <rect key={`b${i}`} x={x} y={y} width={w} height={h} rx={6} fill="#DFE7EF" />
      ))}

      {ROADS.map(([x1, y1, x2, y2], i) => (
        <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F1F5F9" strokeWidth={16} />
      ))}
      {ROADS.map(([x1, y1, x2, y2], i) => (
        <line
          key={`d${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#fff"
          strokeWidth={2}
          strokeDasharray="10 12"
          opacity={0.7}
        />
      ))}
    </g>
  );
}
