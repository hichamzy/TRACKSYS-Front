// Types d'alerte : libellé, gravité (hi/md/lo) et tracé SVG de l'icône
export const ALERT_TYPES = {
  speed: { label: 'Excès de vitesse', sev: 'hi', path: <path d="M13 2 3 14h9l-1 8 10-12h-9Z" /> },
  stop: { label: 'Arrêt prolongé', sev: 'md', path: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></> },
  idle: { label: 'Moteur au ralenti', sev: 'md', path: <><path d="M12 2v6M5.6 5.6l4.2 4.2M2 12h6M18.4 5.6l-4.2 4.2M22 12h-6" /><circle cx="12" cy="16" r="4" /></> },
  brake: { label: 'Freinage brusque', sev: 'hi', path: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></> },
  gps: { label: 'Perte de signal GPS', sev: 'hi', path: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><path d="M2 2l20 20" /></> },
  battery: { label: 'Batterie balise faible', sev: 'lo', path: <><rect x="2" y="7" width="16" height="10" rx="2" /><path d="M22 11v2M6 11v2" /></> },
  hours: { label: 'Circulation hors horaires', sev: 'md', path: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /><path d="M2 2l20 20" opacity=".5" /></> },
  maint: { label: 'Seuil kilométrique atteint', sev: 'lo', path: <><path d="M14.7 6.3a4 4 0 1 0 5 5L16 15l-3-3Z" /><path d="m9 12-6 6 3 3 6-6" /></> },
};

export const SEV_LABEL = { hi: 'Critique', md: 'Moyenne', lo: 'Info' };

export const SEV_FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'hi', label: 'Critiques' },
  { key: 'md', label: 'Moyennes' },
  { key: 'lo', label: 'Info' },
];

// Canaux globaux (onglet « Règles & seuils » et référentiel « Règles d'alerte »)
export const INITIAL_CHANNELS = [
  { id: 'app', name: 'Notification dans la plateforme', d: "Badge et centre d'alertes", on: true },
  { id: 'mail', name: 'E-mail au superviseur', d: 'Alertes critiques uniquement', on: true },
  { id: 'sms', name: "SMS d'astreinte", d: 'Alertes critiques hors horaires ouvrés', on: false },
  { id: 'daily', name: "Rapport quotidien d'alertes", d: 'Synthèse envoyée chaque matin à 08:00', on: true },
];
