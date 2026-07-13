import Icon from '../components/icons/Icon.jsx';
import LiveMap from '../components/map/LiveMap.jsx';
import VehicleList from './fleet/VehicleList.jsx';
import VehicleDetail from './fleet/VehicleDetail.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function FleetView() {
  const { showToast } = useApp();

  return (
    <section className="view show">
      <div className="live-wrap">
        <LiveMap />

        <div className="live-chip">
          <i /> LIVE · Casablanca
        </div>

        <div className="map-tools">
          <button title="Zoom +" onClick={() => showToast('Zoom avant (maquette)')}>
            <Icon name="plus" />
          </button>
          <button title="Zoom -" onClick={() => showToast('Zoom arrière (maquette)')}>
            <Icon name="minus" />
          </button>
          <button title="Centrer" onClick={() => showToast('Carte recentrée sur Casablanca')}>
            <Icon name="target" />
          </button>
        </div>

        <div className="map-legend">
          <div className="leg">
            <i style={{ background: 'var(--cyan)' }} /> En tournée
          </div>
          <div className="leg">
            <i style={{ background: 'var(--warn)' }} /> À l'arrêt
          </div>
          <div className="leg">
            <i style={{ background: 'var(--faint)' }} /> Hors service
          </div>
        </div>

        <VehicleList />
        <VehicleDetail />
      </div>
    </section>
  );
}
