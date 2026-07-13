// Réclamations citoyennes — x/y = position sur la carte SVG (1000x720)
export const INITIAL_COMPLAINTS = [
  { id: 'RC-2087', type: 'Dépôt sauvage', zone: 'Bd Anfa, Maârif', prio: 'Haute', status: 'En cours', assign: 'BN-04', time: '2 min', date: "Aujourd'hui 09:14", x: 720, y: 300 },
  { id: 'RC-2084', type: 'Bac endommagé', zone: 'Rue Ahfir, Anfa', prio: 'Moyenne', status: 'En cours', assign: 'BN-02', time: '26 min', date: "Aujourd'hui 08:50", x: 300, y: 180 },
  { id: 'RC-2081', type: 'Collecte manquée', zone: 'Rue de la Corniche, Aïn Diab', prio: 'Moyenne', status: 'Reçue', assign: null, time: '34 min', date: "Aujourd'hui 08:42", x: 300, y: 560 },
  { id: 'RC-2088', type: 'Éclairage public', zone: 'Bd Rachidi, Sidi Belyout', prio: 'Basse', status: 'Reçue', assign: null, time: '8 min', date: "Aujourd'hui 09:08", x: 600, y: 200 },
  { id: 'RC-2079', type: 'Dépôt sauvage', zone: 'Corniche Ouest', prio: 'Haute', status: 'Résolue', assign: 'BN-09', time: '18 min', date: "Aujourd'hui 07:20", x: 520, y: 600 },
  { id: 'RC-2076', type: 'Voirie (nid-de-poule)', zone: 'Bd Oued Sebou, Hay Hassani', prio: 'Basse', status: 'En cours', assign: 'BN-11', time: '1 h', date: "Aujourd'hui 08:05", x: 840, y: 440 },
  { id: 'RC-2072', type: 'Dépôt sauvage', zone: 'Rue Jenner, Maârif Sud', prio: 'Moyenne', status: 'Résolue', assign: 'BN-07', time: '2 h', date: "Aujourd'hui 07:02", x: 640, y: 360 },
  { id: 'RC-2091', type: 'Collecte manquée', zone: 'Rue Normandie', prio: 'Moyenne', status: 'Reçue', assign: null, time: '5 min', date: "Aujourd'hui 09:11", x: 360, y: 300 },
  { id: 'RC-2090', type: 'Bac endommagé', zone: 'Bd Zerktouni', prio: 'Basse', status: 'Reçue', assign: null, time: '12 min', date: "Aujourd'hui 09:04", x: 470, y: 250 },
  { id: 'RC-2086', type: 'Dépôt sauvage', zone: 'Rue Ibnou Mounir', prio: 'Haute', status: 'En cours', assign: 'BN-07', time: '15 min', date: "Aujourd'hui 09:01", x: 660, y: 180 },
  { id: 'RC-2083', type: 'Éclairage public', zone: "Bd d'Anfa", prio: 'Basse', status: 'En cours', assign: 'BN-14', time: '40 min', date: "Aujourd'hui 08:36", x: 220, y: 150 },
  { id: 'RC-2080', type: 'Voirie (nid-de-poule)', zone: 'Rue Ahmed Charci', prio: 'Moyenne', status: 'En cours', assign: 'BN-02', time: '52 min', date: "Aujourd'hui 08:24", x: 410, y: 435 },
  { id: 'RC-2078', type: 'Bac endommagé', zone: 'Bd Ghandi', prio: 'Basse', status: 'Résolue', assign: 'BN-09', time: '1 h 10', date: "Aujourd'hui 08:00", x: 250, y: 480 },
  { id: 'RC-2075', type: 'Collecte manquée', zone: 'Rue Taha Hussein', prio: 'Moyenne', status: 'Résolue', assign: 'BN-04', time: '1 h 30', date: "Aujourd'hui 07:40", x: 560, y: 470 },
  { id: 'RC-2071', type: 'Dépôt sauvage', zone: 'Rue Assilah', prio: 'Haute', status: 'Résolue', assign: 'BN-11', time: '2 h 20', date: "Aujourd'hui 06:50", x: 760, y: 520 },
];

export const SLA_MAP = {
  'Dépôt sauvage': '4 h',
  'Bac endommagé': '24 h',
  'Collecte manquée': '12 h',
  'Éclairage public': '72 h',
  'Voirie (nid-de-poule)': '72 h',
};

export const STATUS_ORDER = ['Reçue', 'En cours', 'Résolue'];

export const STATUS_CHIP = {
  'Reçue': 'st-recue',
  'En cours': 'st-encours',
  'Résolue': 'st-resolue',
};

// Options du filtre catégorie (valeur = type de réclamation, libellé affiché)
export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'Dépôt sauvage', label: 'Dépôt sauvage' },
  { value: 'Bac endommagé', label: 'Bac endommagé' },
  { value: 'Collecte manquée', label: 'Collecte manquée' },
  { value: 'Éclairage public', label: 'Éclairage public' },
  { value: 'Voirie (nid-de-poule)', label: 'Voirie' },
];

// Répartition des réclamations par catégorie (tableau de bord — 7 derniers jours)
export const CATEGORY_BREAKDOWN = [
  { label: 'Dépôt sauvage', pct: 88, value: 34 },
  { label: 'Bac endommagé', pct: 56, value: 21 },
  { label: 'Collecte manquée', pct: 44, value: 17 },
  { label: 'Éclairage public', pct: 30, value: 11 },
  { label: 'Voirie', pct: 18, value: 7 },
];

// Flux « Activité en direct » du tableau de bord
export const LIVE_FEED = [
  { color: 'var(--orange)', title: 'Nouvelle réclamation', text: ' — Dépôt sauvage, Bd Anfa (Maârif).', time: 'il y a 2 min · RC-2087' },
  { color: 'var(--cyan)', title: 'BN-04', text: ' en intervention sur RC-2087 — trajet 1,4 km.', time: 'il y a 2 min · en route' },
  { color: 'var(--ok)', title: 'RC-2079 résolue', text: ' — photo de clôture reçue.', time: 'il y a 18 min · Aïn Diab' },
  { color: 'var(--warn)', title: 'BN-11', text: " à l'arrêt > 20 min hors zone planifiée.", time: 'il y a 24 min · alerte géo-clôture' },
  { color: 'var(--cyan)', title: 'Tournée Anfa terminée', text: ' — 18 points de collecte.', time: 'il y a 41 min · BN-02' },
];
