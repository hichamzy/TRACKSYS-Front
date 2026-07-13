// Trajet réalisé rejoué dans la vue « Historique » (BN-04, 06/07/2026) — coordonnées [lng, lat] réelles (Casablanca)
export const HIST_ROUTE = [
  [-7.6420, 33.5790], [-7.6420, 33.5860], [-7.6390, 33.5850], [-7.6390, 33.5900], [-7.6250, 33.5900], [-7.6250, 33.5780], [-7.6280, 33.5830],
  [-7.6280, 33.5730], [-7.6180, 33.5720], [-7.6180, 33.5680], [-7.6350, 33.5700], [-7.6350, 33.5620], [-7.6150, 33.5610], [-7.6120, 33.5680],
  [-7.6120, 33.5820], [-7.6250, 33.5820], [-7.6390, 33.5820], [-7.6420, 33.5810], [-7.6420, 33.5790],
];

export const HIST_STOPS = [
  { lng: -7.6420, lat: 33.5790, t: '06:12', n: 'Départ · Dépôt Anfa', type: 'start' },
  { lng: -7.6390, lat: 33.5850, t: '06:34', n: 'Rue Ahfir' },
  { lng: -7.6250, lat: 33.5900, t: '07:02', n: 'Bd Massira' },
  { lng: -7.6250, lat: 33.5780, t: '07:41', n: 'Place Zellaqa' },
  { lng: -7.6180, lat: 33.5680, t: '08:20', n: 'Bd Anfa' },
  { lng: -7.6350, lat: 33.5620, t: '09:05', n: 'Rue Jenner' },
  { lng: -7.6150, lat: 33.5610, t: '09:48', n: 'Corniche Ouest' },
  { lng: -7.6120, lat: 33.5820, t: '10:36', n: 'Maârif Nord' },
  { lng: -7.6420, lat: 33.5810, t: '12:14', n: 'Arrivée · Dépôt Anfa', type: 'end' },
];

export const START_MIN = 6 * 60 + 12; // 06:12
export const END_MIN = 12 * 60 + 14; // 12:14
export const DUR_MIN = END_MIN - START_MIN;

// Durée de la relecture complète en 1× (ms)
export const PLAY_DURATION_MS = 22000;

export const HIST_VEHICLE_OPTIONS = [
  { value: 'BN-04', label: 'BN-04 · 7714-B-6 (Y. Bennani)' },
  { value: 'BN-02', label: 'BN-02 · 4821-A-6 (H. El Amrani)' },
  { value: 'BN-07', label: 'BN-07 · 3390-A-6 (K. Saïdi)' },
  { value: 'BN-09', label: 'BN-09 · 2205-C-6 (M. Fassi)' },
];

export const HIST_KPIS = [
  { icon: 'gauge', tone: 'kn', value: '62,4', unit: ' km', label: 'Distance parcourue' },
  { icon: 'clock', tone: 'kc', value: '6 h 48', label: 'Durée de service' },
  { icon: 'flag', tone: 'kg', value: '06:12', label: 'Départ · Dépôt Anfa' },
  { icon: 'pin', tone: 'ko', cit: true, value: '12:14', label: 'Arrivée · Dépôt Anfa' },
];
