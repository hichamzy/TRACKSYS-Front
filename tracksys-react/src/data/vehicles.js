// statut -> [classe pastille, libellé, classe badge, classe chip tableau, libellé référentiel]
export const STATUS_MAP = {
  active: { dot: 's-active', label: 'En tournée', badge: 'b-active', chip: 'c-on', refLabel: 'En service' },
  idle: { dot: 's-idle', label: "À l'arrêt", badge: 'b-idle', chip: 'c-idle', refLabel: "À l'arrêt" },
  off: { dot: 's-off', label: 'Hors service', badge: 'b-off', chip: 'c-off', refLabel: 'Hors service' },
};

export const STATUS_COLOR = { active: '#22B2CE', idle: '#EF8A1E', off: '#98A2B3' };

export const VEHICLE_TYPES = ['Benne 12 m³', 'Benne 6 m³', 'Ampliroll', 'Laveuse voirie', 'Véhicule léger'];

export const FLEET_FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'active', label: 'En tournée' },
  { key: 'idle', label: "À l'arrêt" },
  { key: 'off', label: 'Hors' },
];
