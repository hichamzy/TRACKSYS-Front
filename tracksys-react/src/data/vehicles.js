// Référentiel véhicules — `route` = polyligne parcourue en boucle sur la carte live, coordonnées [lng, lat] réelles (Casablanca)
export const INITIAL_VEHICLES = [
  { id: 'BN-02', plate: '4821-A-6', type: 'Benne 12 m³', driver: 'H. El Amrani', zone: 'Anfa', status: 'active', speed: 34, distToday: 41.2, drive: '4 h 05', lastStop: '6 min', imei: 'FMC650·8671', route: [[-7.6529, 33.5850], [-7.6390, 33.5850], [-7.6390, 33.5760], [-7.6250, 33.5760]] },
  { id: 'BN-04', plate: '7714-B-6', type: 'Benne 12 m³', driver: 'Y. Bennani', zone: 'Maârif', status: 'active', speed: 28, distToday: 37.6, drive: '3 h 48', lastStop: '2 min', imei: 'FMC650·8672', route: [[-7.6250, 33.5760], [-7.6250, 33.5660], [-7.6120, 33.5660], [-7.6120, 33.5780]], target: 'RC-2087' },
  { id: 'BN-07', plate: '3390-A-6', type: 'Ampliroll', driver: 'K. Saïdi', zone: 'Sidi Belyout', status: 'active', speed: 41, distToday: 52.9, drive: '5 h 10', lastStop: '11 min', imei: 'FMC150·5510', route: [[-7.6100, 33.5940], [-7.6220, 33.5940], [-7.6220, 33.5850], [-7.6320, 33.5850]] },
  { id: 'BN-09', plate: '2205-C-6', type: 'Benne 6 m³', driver: 'M. Fassi', zone: 'Aïn Diab', status: 'active', speed: 22, distToday: 29.4, drive: '2 h 55', lastStop: '4 min', imei: 'FMC920·9204', route: [[-7.6650, 33.5900], [-7.6520, 33.5920], [-7.6520, 33.5860], [-7.6380, 33.5860]] },
  { id: 'BN-11', plate: '6612-A-6', type: 'Benne 12 m³', driver: 'R. Chraïbi', zone: 'Hay Hassani', status: 'idle', speed: 0, distToday: 18.1, drive: '1 h 40', lastStop: '22 min', imei: 'FMC650·8676', route: [[-7.6650, 33.5480], [-7.6650, 33.5480]] },
  { id: 'BN-14', plate: '1188-B-6', type: 'Laveuse voirie', driver: 'S. Ouali', zone: 'Aïn Sebaâ', status: 'active', speed: 37, distToday: 44.7, drive: '4 h 22', lastStop: '8 min', imei: 'FMC150·5514', route: [[-7.5850, 33.6020], [-7.5850, 33.6120], [-7.5700, 33.6120]] },
  { id: 'BN-16', plate: '9042-A-6', type: 'Benne 12 m³', driver: 'A. Ziani', zone: 'Dépôt', status: 'off', speed: 0, distToday: 0, drive: '—', lastStop: '—', imei: 'FMC650·8681', route: [[-7.6000, 33.5700], [-7.6000, 33.5700]] },
];

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
