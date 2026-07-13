export const DRIVERS = [
  { name: 'H. El Amrani', phone: '06 61 •• •• 12', licence: 'C · valide', vehicle: 'BN-02', status: 'En service', chip: 'c-on' },
  { name: 'Y. Bennani', phone: '06 62 •• •• 47', licence: 'C · valide', vehicle: 'BN-04', status: 'En service', chip: 'c-on' },
  { name: 'K. Saïdi', phone: '06 60 •• •• 03', licence: 'C · valide', vehicle: 'BN-07', status: 'En service', chip: 'c-on' },
  { name: 'M. Fassi', phone: '06 55 •• •• 88', licence: 'C · valide', vehicle: 'BN-09', status: 'Repos', chip: 'c-idle' },
  { name: 'R. Chraïbi', phone: '06 78 •• •• 21', licence: 'C · valide', vehicle: 'BN-11', status: 'En service', chip: 'c-on' },
];

// Chauffeurs proposés à l'affectation dans le formulaire « Nouveau véhicule »
export const DRIVER_OPTIONS = ['Non affecté', 'H. El Amrani', 'Y. Bennani', 'K. Saïdi', 'M. Fassi'];

export const COMPLAINT_CATEGORIES = [
  { label: 'Dépôt sauvage', icon: '🗑️', prio: 'Haute', sla: '4 h', active: true },
  { label: 'Bac endommagé', icon: '♻️', prio: 'Moyenne', sla: '24 h', active: true },
  { label: 'Collecte manquée', icon: '🚛', prio: 'Moyenne', sla: '12 h', active: true },
  { label: 'Éclairage public', icon: '💡', prio: 'Basse', sla: '72 h', active: true },
  { label: 'Voirie (nid-de-poule)', icon: '🕳️', prio: 'Basse', sla: '72 h', active: false },
];

export const USERS = [
  { name: 'A. Tarhine', email: 'a.tarhine@commune.ma', role: 'Superviseur', scope: 'Toutes zones', active: true },
  { name: 'N. Alaoui', email: 'n.alaoui@commune.ma', role: 'Agent traitement', scope: 'Anfa · Maârif', active: true },
  { name: 'F. Berrada', email: 'f.berrada@commune.ma', role: 'Agent traitement', scope: 'Sidi Belyout · Aïn Diab', active: true },
  { name: 'Dispatch ALEXSYS', email: 'ops@alexsys.ma', role: 'Exploitant flotte', scope: 'Toutes zones', active: true },
];

export const NOTIF_RECIPIENTS = ['Superviseur + agents de traitement', 'Superviseur uniquement', 'Tous les utilisateurs'];
export const NOTIF_FREQUENCIES = ['Temps réel + récap quotidien', 'Temps réel uniquement', 'Récap quotidien uniquement'];
