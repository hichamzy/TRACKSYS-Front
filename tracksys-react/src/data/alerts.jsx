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

// `det` peut contenir des passages en gras : ils sont décrits en segments {t, b}
export const INITIAL_ALERTS = [
  { id: 'AL-1042', k: 'speed', veh: 'BN-07', det: [{ t: '82 km/h relevés (limite 50 km/h) — Bd Zerktouni' }], time: 'il y a 6 min', unread: true },
  { id: 'AL-1041', k: 'stop', veh: 'BN-11', det: [{ t: 'Arrêt de ' }, { t: '24 min', b: true }, { t: ' (seuil : 20 min)' }], time: 'il y a 24 min', unread: true },
  { id: 'AL-1040', k: 'brake', veh: 'BN-04', det: [{ t: 'Décélération brutale détectée — Rue Jenner' }], time: 'il y a 38 min', unread: true },
  { id: 'AL-1039', k: 'gps', veh: 'BN-16', det: [{ t: 'Aucune position reçue depuis ' }, { t: '42 min', b: true }], time: 'il y a 42 min', unread: true },
  { id: 'AL-1038', k: 'idle', veh: 'BN-02', det: [{ t: 'Moteur tournant à l’arrêt pendant ' }, { t: '13 min', b: true }], time: 'il y a 1 h', unread: true },
  { id: 'AL-1037', k: 'speed', veh: 'BN-14', det: [{ t: '71 km/h relevés (limite 50 km/h) — Bd Ghandi' }], time: 'il y a 1 h', unread: true },
  { id: 'AL-1036', k: 'battery', veh: 'BN-09', det: [{ t: 'Batterie de la balise à ' }, { t: '12 %', b: true }], time: 'il y a 2 h', unread: true },
  { id: 'AL-1035', k: 'hours', veh: 'BN-11', det: [{ t: 'Circulation détectée à 22:14 (hors plage 06:00–20:00)' }], time: 'hier', unread: false },
  { id: 'AL-1034', k: 'maint', veh: 'BN-02', det: [{ t: '15 000 km', b: true }, { t: ' atteints — révision à planifier' }], time: 'hier', unread: false },
  { id: 'AL-1033', k: 'stop', veh: 'BN-07', det: [{ t: 'Arrêt de ' }, { t: '31 min', b: true }, { t: ' (seuil : 20 min)' }], time: 'hier', unread: false },
  { id: 'AL-1032', k: 'speed', veh: 'BN-04', det: [{ t: '64 km/h relevés (limite 50 km/h) — Bd Anfa' }], time: 'hier', unread: false },
];

export const INITIAL_RULES = [
  { k: 'speed', on: true, val: 50, unit: 'km/h', d: 'Déclenche si la vitesse dépasse le seuil pendant plus de 10 s', channels: { app: true, mail: true, sms: false } },
  { k: 'stop', on: true, val: 20, unit: 'min', d: 'Déclenche si le véhicule reste immobile au-delà du seuil', channels: { app: true, mail: true, sms: false } },
  { k: 'idle', on: true, val: 10, unit: 'min', d: 'Moteur tournant véhicule à l’arrêt (surconsommation)', channels: { app: true, mail: true, sms: false } },
  { k: 'brake', on: true, val: 8, unit: 'm/s²', d: 'Décélération supérieure au seuil (conduite à risque)', channels: { app: true, mail: true, sms: false } },
  { k: 'gps', on: true, val: 30, unit: 'min', d: 'Aucune position reçue de la balise au-delà du seuil', channels: { app: true, mail: true, sms: false } },
  { k: 'battery', on: true, val: 15, unit: '%', d: 'Niveau de batterie de la balise sous le seuil', channels: { app: true, mail: true, sms: false } },
  { k: 'hours', on: true, val: 20, unit: 'h', d: 'Circulation détectée en dehors de la plage autorisée', channels: { app: true, mail: true, sms: false } },
  { k: 'maint', on: true, val: 15000, unit: 'km', d: 'Kilométrage atteint depuis la dernière révision', channels: { app: true, mail: true, sms: false } },
];

// Canaux globaux (onglet « Règles & seuils » et référentiel « Règles d'alerte »)
export const INITIAL_CHANNELS = [
  { id: 'app', name: 'Notification dans la plateforme', d: "Badge et centre d'alertes", on: true },
  { id: 'mail', name: 'E-mail au superviseur', d: 'Alertes critiques uniquement', on: true },
  { id: 'sms', name: "SMS d'astreinte", d: 'Alertes critiques hors horaires ouvrés', on: false },
  { id: 'daily', name: "Rapport quotidien d'alertes", d: 'Synthèse envoyée chaque matin à 08:00', on: true },
];

export const ALERT_VEHICLE_OPTIONS = ['all', 'BN-02', 'BN-04', 'BN-07', 'BN-09', 'BN-11', 'BN-14'];
