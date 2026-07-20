import { useState } from 'react';
import Tabs from '../components/ui/Tabs.jsx';
import VehiclesTab from './settings/VehiclesTab.jsx';
import CitiesTab from './settings/CitiesTab.jsx';
import { DriversTab, RulesTab, CategoriesTab, UsersTab } from './settings/ReferentialTabs.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const BASE_TABS = [
  { key: 'veh', label: 'Véhicules', icon: 'truck' },
  { key: 'drv', label: 'Chauffeurs', icon: 'user' },
  { key: 'rules', label: "Règles d'alerte", icon: 'bell' },
  { key: 'cat', label: 'Catégories réclamation', icon: 'list' },
  { key: 'user', label: 'Utilisateurs & rôles', icon: 'users' },
];

const CITIES_TAB = { key: 'cities', label: 'Villes', icon: 'pin' };

const PANELS = {
  veh: VehiclesTab,
  drv: DriversTab,
  rules: RulesTab,
  cat: CategoriesTab,
  user: UsersTab,
  cities: CitiesTab,
};

export default function SettingsView() {
  const { user } = useAuth();
  const [tab, setTab] = useState('veh');
  const tabs = user?.isSuperAdmin ? [...BASE_TABS, CITIES_TAB] : BASE_TABS;
  const Panel = PANELS[tab];

  return (
    <section className="view show">
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <Panel />
    </section>
  );
}
