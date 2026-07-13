/**
 * Bibliothèque d'icônes — reprend exactement les tracés SVG de la maquette.
 * Usage : <Icon name="truck" /> · <Icon name="play" filled />
 */
const PATHS = {
  // --- navigation ---
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  truck: <path d="M3 17V9a1 1 0 0 1 1-1h9v9M13 12h5l3 3v2h-2M6 20a2 2 0 1 0 0-4M18 20a2 2 0 1 0 0-4" />,
  truckSmall: (
    <path d="M3 16V8a1 1 0 0 1 1-1h8v8M12 11h4l3 3v2h-2M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
  bellOpen: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />,
  report: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h5M8 17h8" />
    </>
  ),
  complaint: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      <path d="M12 8v3M12 14h.01" />
    </>
  ),
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4.5a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 8.6l-.36-.36a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 5.6V4.5a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 18 6.6l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.4 12v.09" />
    </>
  ),

  // --- KPI / divers ---
  gauge: (
    <>
      <path d="M12 2a10 10 0 0 1 10 10" />
      <circle cx="12" cy="12" r="10" opacity=".25" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  checkCircle: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </>
  ),
  clipboardCheck: (
    <>
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  warning: (
    <>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9Z" />,
  users: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
    </>
  ),
  flag: <path d="M5 3v18M5 4h13l-3 4 3 4H5" />,
  pin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  sliders: <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />,
  list: <path d="M3 7h18M3 12h18M3 17h18" />,

  // --- actions ---
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  searchAlt: (
    <>
      <path d="m21 21-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  target: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  excel: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M9 15l3 3 3-3M12 12v6" />
    </>
  ),
  printer: <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6Z" />,
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  refresh: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  stopSquare: <rect x="6" y="6" width="12" height="12" rx="2" />,
};

// Icônes pleines (fill) plutôt que tracées
const FILLED = {
  play: <path d="M8 5v14l11-7z" />,
  pause: <path d="M6 5h4v14H6zM14 5h4v14h-4z" />,
};

export default function Icon({ name, size, width = 2, className, style, filled = false }) {
  const content = filled ? FILLED[name] : PATHS[name];
  if (!content) return null;

  const dims = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : width}
      className={className}
      style={style}
      {...dims}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
