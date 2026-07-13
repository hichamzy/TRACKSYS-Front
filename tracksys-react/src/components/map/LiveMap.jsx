import { useRef } from 'react';
import MapBase from './MapBase.jsx';
import useFleetAnimation from '../../hooks/useFleetAnimation.js';
import { STATUS_COLOR } from '../../data/vehicles.js';
import { useApp } from '../../context/AppContext.jsx';

export default function LiveMap() {
  const { vehicles, openComplaints, selectVehicle, setOpenComplaintId, followId } = useApp();

  const nodesRef = useRef({});
  const ringRef = useRef(null);

  useFleetAnimation(vehicles, nodesRef, ringRef, followId);

  return (
    <svg className="map-svg" viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid slice">
      <MapBase />

      {/* Réclamations ouvertes */}
      <g id="pins">
        {openComplaints.map((c) => (
          <g key={c.id} cursor="pointer" onClick={() => setOpenComplaintId(c.id)}>
            <circle cx={c.x} cy={c.y} r={16} fill="rgba(239,138,30,.18)" />
            <circle cx={c.x} cy={c.y} r={9} fill="#EF8A1E" stroke="#fff" strokeWidth={2.5}>
              {c.prio === 'Haute' && (
                <animate attributeName="r" values="9;13;9" dur="1.8s" repeatCount="indefinite" />
              )}
            </circle>
          </g>
        ))}
      </g>

      {/* Véhicules */}
      <g id="trucks">
        {vehicles.map((v) => (
          <g
            key={v.id}
            cursor="pointer"
            ref={(node) => {
              if (node) nodesRef.current[v.id] = node;
              else delete nodesRef.current[v.id];
            }}
            onClick={() => selectVehicle(v.id)}
          >
            {v.status === 'active' && <circle cx={0} cy={0} r={16} fill="rgba(34,178,206,.14)" />}
            <circle cx={0} cy={0} r={12} fill="#fff" />
            <circle cx={0} cy={0} r={8.5} fill={STATUS_COLOR[v.status]} />
            <text
              x={0}
              y={-18}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fontFamily="IBM Plex Mono"
              fill="#221238"
            >
              {v.id}
            </text>
          </g>
        ))}
      </g>

      {/* Cercle de suivi en direct */}
      <circle ref={ringRef} cx={0} cy={0} r={22} fill="none" stroke="#22B2CE" strokeWidth={3} opacity={0} pointerEvents="none">
        <animate attributeName="r" values="20;27;20" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
