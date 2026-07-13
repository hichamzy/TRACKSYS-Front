import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_VEHICLES } from '../data/vehicles.js';
import { INITIAL_COMPLAINTS } from '../data/complaints.js';
import { INITIAL_ALERTS, INITIAL_RULES, INITIAL_CHANNELS } from '../data/alerts.jsx';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ---------- navigation ---------- */
  const [view, setView] = useState('dash');

  /* ---------- référentiels ---------- */
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [complaints] = useState(INITIAL_COMPLAINTS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [channels, setChannels] = useState(INITIAL_CHANNELS);

  /* ---------- sélections ---------- */
  const [selectedVehId, setSelectedVehId] = useState(null); // panneau flottant carte live
  const [followId, setFollowId] = useState(null); // suivi en direct
  const [openComplaintId, setOpenComplaintId] = useState(null); // modale réclamation
  const [histVehicle, setHistVehicle] = useState('BN-04'); // véhicule de l'historique

  /* ---------- toast ---------- */
  const [toast, setToast] = useState({ msg: '', visible: false });
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast({ msg, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2600);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ---------- actions véhicules ---------- */
  const addVehicle = useCallback(
    (form) => {
      const id = form.id.trim() || `BN-${10 + vehicles.length}`;
      const plate = form.plate.trim() || '0000-A-6';
      setVehicles((list) => [
        ...list,
        {
          id,
          plate,
          type: form.type,
          driver: form.driver,
          status: 'idle',
          speed: 0,
          distToday: 0,
          drive: '—',
          lastStop: '0 min',
          imei: form.imei.trim() || '—',
          route: [[900, 600], [900, 600]],
        },
      ]);
      showToast(`Véhicule ${id} ajouté au référentiel`);
      return id;
    },
    [vehicles.length, showToast]
  );

  const selectVehicle = useCallback((id) => setSelectedVehId(id), []);
  const closeDetail = useCallback(() => setSelectedVehId(null), []);

  const toggleFollow = useCallback(
    (id) => {
      setFollowId((cur) => {
        const next = cur === id ? null : id;
        showToast(next ? `Suivi en direct de ${id} activé` : 'Suivi en direct arrêté');
        return next;
      });
    },
    [showToast]
  );

  /** Depuis le détail véhicule : bascule vers l'historique de ce véhicule */
  const gotoHistory = useCallback((id) => {
    setHistVehicle(id);
    setView('hist');
  }, []);

  /* ---------- actions alertes ---------- */
  const markAllRead = useCallback(() => {
    setAlerts((list) => list.map((a) => ({ ...a, unread: false })));
    showToast('Toutes les alertes marquées comme lues');
  }, [showToast]);

  const unreadCount = useMemo(() => alerts.filter((a) => a.unread).length, [alerts]);

  /* ---------- actions règles ---------- */
  const setRuleValue = useCallback(
    (index, val) => {
      setRules((list) => list.map((r, i) => (i === index ? { ...r, val } : r)));
      showToast('Seuil mis à jour');
    },
    [showToast]
  );

  const toggleRule = useCallback(
    (index) => {
      setRules((list) =>
        list.map((r, i) => {
          if (i !== index) return r;
          showToast(!r.on ? 'Règle activée' : 'Règle désactivée');
          return { ...r, on: !r.on };
        })
      );
    },
    [showToast]
  );

  const toggleRuleChannel = useCallback((index, channel) => {
    setRules((list) =>
      list.map((r, i) => (i === index ? { ...r, channels: { ...r.channels, [channel]: !r.channels[channel] } } : r))
    );
  }, []);

  const toggleChannel = useCallback((id) => {
    setChannels((list) => list.map((c) => (c.id === id ? { ...c, on: !c.on } : c)));
  }, []);

  /* ---------- réclamations ---------- */
  const openComplaints = useMemo(() => complaints.filter((c) => c.status !== 'Résolue'), [complaints]);

  /* ---------- Échap : ferme modale + panneau détail ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenComplaintId(null);
        setSelectedVehId(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const value = {
    view,
    setView,
    vehicles,
    addVehicle,
    complaints,
    openComplaints,
    alerts,
    unreadCount,
    markAllRead,
    rules,
    setRuleValue,
    toggleRule,
    toggleRuleChannel,
    channels,
    toggleChannel,
    selectedVehId,
    selectVehicle,
    closeDetail,
    followId,
    toggleFollow,
    openComplaintId,
    setOpenComplaintId,
    histVehicle,
    setHistVehicle,
    gotoHistory,
    toast,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé à l’intérieur de <AppProvider>');
  return ctx;
}
