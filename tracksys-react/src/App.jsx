import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';
import Toast from './components/ui/Toast.jsx';
import ComplaintModal from './views/complaints/ComplaintModal.jsx';
import DashboardView from './views/DashboardView.jsx';
import FleetView from './views/FleetView.jsx';
import HistoryView from './views/HistoryView.jsx';
import AlertsView from './views/AlertsView.jsx';
import ReportsView from './views/ReportsView.jsx';
import ComplaintsView from './views/ComplaintsView.jsx';
import SettingsView from './views/SettingsView.jsx';
import LoginView from './views/LoginView.jsx';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { NAV_GROUPS, filterNavGroupsByModules } from './data/navigation.js';

// Une vue = un composant. La clé du menu latéral pilote l'affichage.
const VIEWS = {
  dash: DashboardView,
  fleet: FleetView,
  hist: HistoryView,
  alerts: AlertsView,
  report: ReportsView,
  cit: ComplaintsView,
  settings: SettingsView,
};

function AppShell() {
  const { view } = useApp();
  const { user } = useAuth();

  // La vue courante (ex. state persistant, ou 'dash' par défaut) peut correspondre à un
  // module désactivé pour la ville de l'utilisateur — retombe sur la première vue
  // réellement disponible plutôt qu'un fallback fixe sur 'dash' (lui-même désactivable).
  const availableGroups = filterNavGroupsByModules(NAV_GROUPS, user?.enabledModules ?? new Set(), user?.isSuperAdmin ?? false);
  const availableViews = new Set(availableGroups.flatMap((g) => g.items.map((i) => i.view)));
  const firstAvailableView = availableGroups[0]?.items[0]?.view ?? 'dash';
  const resolvedView = user?.isSuperAdmin || availableViews.has(view) ? view : firstAvailableView;
  const CurrentView = VIEWS[resolvedView] ?? DashboardView;

  return (
    <>
      <Sidebar />

      <div className="main">
        <Topbar />
        <div className="canvas">
          {/* key = remontage à chaque changement de vue → rejoue l'animation d'apparition
              et les animations SVG des graphiques, comme dans la maquette */}
          <CurrentView key={view} />
        </div>
      </div>

      {/* Modale réclamation : globale, ouvrable depuis la liste OU depuis un repère de la carte live */}
      <ComplaintModal />
      <Toast />
    </>
  );
}

export default function App() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) return null; // reprise de session silencieuse en cours
  if (!isAuthenticated) return <LoginView />;

  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
