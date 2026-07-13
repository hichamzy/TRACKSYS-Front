# TRACKSYS — version React

Portage React (Vite) de la maquette HTML `traxis-maquette.html`. Aucune fonctionnalité n'a été retirée : les 7 vues, les cartes SVG animées, le lecteur de trajet, la modale réclamation, les exports Excel (CSV), les toasts et les référentiels sont tous présents.

## Démarrage

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle de production dans dist/
```

## Structure

```
src/
├─ main.jsx                  point d'entrée (monte AppProvider + App)
├─ App.jsx                   layout + routage entre les vues
├─ styles/global.css         CSS de la maquette, repris à l'identique
│
├─ context/AppContext.jsx    état global : vue courante, véhicules, réclamations,
│                            alertes, règles, canaux, sélection, suivi, toast
├─ hooks/
│  └─ useFleetAnimation.js   boucle requestAnimationFrame des camions (carte live)
│
├─ data/                     toutes les données de démonstration, séparées de l'UI
│  ├─ navigation.js          menu latéral + titres de page
│  ├─ vehicles.js            flotte, mapping des statuts, types, filtres
│  ├─ complaints.js          réclamations, SLA, catégories, flux d'activité
│  ├─ alerts.jsx             types d'alerte (+ icônes), alertes, règles, canaux
│  ├─ history.js             trajet rejoué, arrêts, KPI, options
│  ├─ reports.js             séries des graphiques, rapports enregistrés
│  └─ referentials.js        chauffeurs, catégories, utilisateurs
│
├─ components/
│  ├─ icons/Icon.jsx         toutes les icônes SVG de la maquette (<Icon name="truck" />)
│  ├─ layout/                Sidebar, Topbar
│  ├─ ui/                    Panel, KpiCard, Tabs, Segmented, Switch, Modal, Toast
│  ├─ map/                   MapBase (fond), LiveMap, HistoryMap, MiniMap
│  └─ charts/                BarChart, LineChart (animés, SVG pur)
│
├─ views/
│  ├─ DashboardView.jsx      KPI, activité en direct, réclamations par catégorie
│  ├─ FleetView.jsx          carte live + panneaux flottants
│  │  └─ fleet/              VehicleList, VehicleDetail (suivi en direct)
│  ├─ HistoryView.jsx        rejeu du trajet
│  │  └─ history/            TripPlayer (play/pause/scrub/vitesse), StopList
│  ├─ AlertsView.jsx         flux + règles & seuils
│  │  └─ alerts/             AlertList, RuleList, ChannelList
│  ├─ ReportsView.jsx        générateur, graphiques, rapports enregistrés
│  ├─ ComplaintsView.jsx     liste filtrable
│  │  └─ complaints/         ComplaintModal (avant/après, détails, carte, timeline)
│  └─ SettingsView.jsx       5 onglets de référentiels
│     └─ settings/           VehiclesTab (+ formulaire), ReferentialTabs
│
└─ utils/
   ├─ csv.js                 export « Excel » (CSV UTF-8 BOM, séparateur ;)
   ├─ geo.js                 géométrie polyligne, interpolation, formats horaires
   └─ photos.js              photos avant/après simulées (data-URI SVG)
```

## Choix d'implémentation

- **Animation de la carte live** : les positions sont écrites directement dans le DOM SVG (`setAttribute('transform', …)`) via des refs, donc aucun re-render React à 60 fps.
- **Lecteur de trajet** : `requestAnimationFrame` piloté par un état `progress` (0 → 1) ; la position du marqueur et l'arrêt surligné en découlent.
- **CSS** : repris tel quel depuis la maquette (aucun changement visuel). Seul ajout : `#root` porte la mise en page flex du `<body>`.
- **Cohérence des données** : les compteurs (badge alertes, badge réclamations, « Véhicules actifs », « Règles actives ») sont désormais calculés à partir de l'état réel au lieu d'être codés en dur.
- **Modale réclamation globale** : ouvrable depuis la liste *et* depuis un repère de la carte live, comme dans la maquette.
- **Accessibilité** : `Échap` ferme la modale et le panneau de détail, éléments cliquables focusables au clavier.

## Brancher une vraie API

Tout l'état vit dans `context/AppContext.jsx` et les données dans `src/data/`. Pour passer en réel : remplacer les imports `INITIAL_*` par des appels (React Query, `fetch`, SignalR pour le temps réel) ; les composants n'ont pas besoin d'être modifiés.
