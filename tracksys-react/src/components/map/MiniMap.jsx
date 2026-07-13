import MapBase from './MapBase.jsx';

/** Mini-carte de localisation d'une réclamation (modale) */
export default function MiniMap({ x, y }) {
  return (
    <svg className="map-svg" viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid slice">
      <MapBase />
      <circle cx={x} cy={y} r={26} fill="rgba(239,138,30,.18)" />
      <circle cx={x} cy={y} r={12} fill="#EF8A1E" stroke="#fff" strokeWidth={3}>
        <animate attributeName="r" values="12;17;12" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
