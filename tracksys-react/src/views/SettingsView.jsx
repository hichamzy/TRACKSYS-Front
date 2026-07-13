import { useState } from 'react';
import Tabs from '../components/ui/Tabs.jsx';
import VehiclesTab from './settings/VehiclesTab.jsx';
import { DriversTab, RulesTab, CategoriesTab, UsersTab } from './settings/ReferentialTabs.jsx';

const TABS = [
  { key: 'veh', label: 'Véhicules', icon: 'truck' },
  { key: 'drv', label: 'Chauffeurs', icon: 'user' },
  { key: 'rules', label: "Règles d'alerte", icon: 'bell' },
  { key: 'cat', label: 'Catégories réclamation', icon: 'list' },
  { key: 'user', label: 'Utilisateurs & rôles', icon: 'users' },
];

const PANELS = {
  veh: VehiclesTab,
  drv: DriversTab,
  rules: RulesTab,
  cat: CategoriesTab,
  user: UsersTab,
};

export default function SettingsView() {
  const [tab, setTab] = useState('veh');
  const Panel = PANELS[tab];

  return (
    <section className="view show">
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <Panel />
    </section>
  );
}
