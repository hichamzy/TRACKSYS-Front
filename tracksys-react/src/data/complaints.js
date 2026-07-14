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

// Flux « Activité en direct » du tableau de bord — aucun concept backend équivalent
// (log d'événements temps réel), reste mock (hors scope du chantier front↔backend).
export const LIVE_FEED = [
  { color: 'var(--orange)', title: 'Nouvelle réclamation', text: ' — Dépôt sauvage, Bd Anfa (Maârif).', time: 'il y a 2 min · RC-2087' },
  { color: 'var(--cyan)', title: 'BN-04', text: ' en intervention sur RC-2087 — trajet 1,4 km.', time: 'il y a 2 min · en route' },
  { color: 'var(--ok)', title: 'RC-2079 résolue', text: ' — photo de clôture reçue.', time: 'il y a 18 min · Aïn Diab' },
  { color: 'var(--warn)', title: 'BN-11', text: " à l'arrêt > 20 min hors zone planifiée.", time: 'il y a 24 min · alerte géo-clôture' },
  { color: 'var(--cyan)', title: 'Tournée Anfa terminée', text: ' — 18 points de collecte.', time: 'il y a 41 min · BN-02' },
];
