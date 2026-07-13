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
import { useApp } from './context/AppContext.jsx';

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

export default function App() {
  const { view } = useApp();
  const CurrentView = VIEWS[view] ?? DashboardView;

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
