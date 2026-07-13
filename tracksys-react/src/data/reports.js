export const MONTHS = ['Aoû', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'];

// Distance flotte cumulée (km) — 12 derniers mois
export const DIST_DATA = [8200, 8900, 9400, 9100, 8700, 7600, 8300, 9800, 10200, 10900, 11100, 11240];

// Taux de résolution sous 48 h (%) — 12 derniers mois
export const RESO_DATA = [71, 74, 72, 78, 80, 76, 79, 83, 85, 84, 86, 87];

export const SAVED_REPORTS = [
  { name: 'Activité de la flotte', period: 'Juin 2026', date: '01/07/2026', format: 'XLSX' },
  { name: 'Réclamations citoyennes', period: 'Juin 2026', date: '01/07/2026', format: 'XLSX' },
  { name: 'Synthèse KPI communal', period: 'T2 2026', date: '01/07/2026', format: 'PDF' },
  { name: 'Tournées & trajets', period: 'Semaine 26', date: '30/06/2026', format: 'XLSX' },
];

export const REPORT_TYPES = ['Activité de la flotte', 'Réclamations citoyennes', 'Tournées & trajets', 'KPI communal (synthèse)'];
export const REPORT_PERIODS = ['Ce mois-ci (juillet 2026)', '7 derniers jours', 'Mois précédent', 'Trimestre en cours', 'Personnalisée…'];
export const REPORT_DETAILS = ['Synthèse', 'Détaillé par véhicule', 'Détaillé par catégorie'];

export const REPORT_KPIS = [
  { icon: 'gauge', tone: 'kn', value: '11 240', unit: ' km', label: 'Distance flotte (mois)' },
  { icon: 'truck', tone: 'kc', value: '312', label: 'Tournées effectuées' },
  { icon: 'complaint', tone: 'ko', cit: true, value: '198', label: 'Réclamations traitées' },
  { icon: 'check-circle', tone: 'kg', value: '41', unit: ' min', label: "Délai moyen d'intervention" },
];
