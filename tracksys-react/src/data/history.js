// Trajet réalisé rejoué dans la vue « Historique » (BN-04, 06/07/2026)
export const HIST_ROUTE = [
  [130, 300], [130, 180], [300, 180], [300, 120], [520, 120], [520, 300], [440, 300],
  [440, 435], [600, 435], [600, 540], [400, 540], [400, 620], [640, 620], [720, 540],
  [720, 340], [520, 340], [300, 340], [130, 340], [130, 300],
];

export const HIST_STOPS = [
  { x: 130, y: 300, t: '06:12', n: 'Départ · Dépôt Anfa', type: 'start' },
  { x: 300, y: 180, t: '06:34', n: 'Rue Ahfir' },
  { x: 520, y: 120, t: '07:02', n: 'Bd Massira' },
  { x: 520, y: 300, t: '07:41', n: 'Place Zellaqa' },
  { x: 600, y: 435, t: '08:20', n: 'Bd Anfa' },
  { x: 400, y: 540, t: '09:05', n: 'Rue Jenner' },
  { x: 640, y: 620, t: '09:48', n: 'Corniche Ouest' },
  { x: 720, y: 340, t: '10:36', n: 'Maârif Nord' },
  { x: 130, y: 340, t: '12:14', n: 'Arrivée · Dépôt Anfa', type: 'end' },
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
