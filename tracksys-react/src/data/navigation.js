// Titres de page (topbar) par vue
export const VIEW_TITLES = {
  dash: ['Tableau de bord', "Vue d'ensemble temps réel de l'exploitation"],
  fleet: ['Flotte & Carte live', 'Suivi géolocalisé temps réel de la flotte'],
  hist: ['Historique des trajets', 'Rejouez un trajet réalisé : départ, arrivée et parcours'],
  report: ['Rapports & KPI', 'Génération et export de rapports (Excel / PDF)'],
  alerts: ['Alertes & notifications', 'Événements détectés et règles de déclenchement'],
  cit: ['Réclamations citoyennes', 'Backoffice de traitement — TRACKSYS Citoyen'],
  settings: ['Paramètres & référentiels', 'Véhicules, chauffeurs, zones, catégories, utilisateurs'],
};

// Structure du menu latéral : groupes -> items
export const NAV_GROUPS = [
  {
    label: 'Supervision',
    items: [
      { view: 'dash', label: 'Tableau de bord', icon: 'dashboard' },
      { view: 'fleet', label: 'Flotte & Carte live', icon: 'truck', dot: true },
      { view: 'hist', label: 'Historique des trajets', icon: 'history' },
      { view: 'alerts', label: 'Alertes & notifications', icon: 'bell', badge: 'alerts' },
      { view: 'report', label: 'Rapports & KPI', icon: 'report' },
    ],
  },
  {
    label: 'Citoyen',
    items: [
      { view: 'cit', label: 'Réclamations', icon: 'complaint', badge: 'complaints', accent: 'cit' },
    ],
  },
  {
    label: 'Administration',
    items: [{ view: 'settings', label: 'Paramètres & référentiels', icon: 'settings' }],
  },
];

// Filtre les groupes/items du menu selon les modules activés pour la ville de
// l'utilisateur (item.view sert directement de code de module — les deux vocabulaires
// sont volontairement identiques). SuperAdmin : aucun filtre, accès total toujours visible.
export function filterNavGroupsByModules(groups, enabledModules, isSuperAdmin) {
  if (isSuperAdmin) return groups;

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => enabledModules.has(item.view)),
    }))
    .filter((group) => group.items.length > 0);
}
