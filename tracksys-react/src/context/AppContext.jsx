import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_CHANNELS } from '../data/alerts.jsx';
import { fleetApi } from '../api/endpoints/fleetApi.js';
import { citizenApi } from '../api/endpoints/citizenApi.js';
import { alertingApi } from '../api/endpoints/alertingApi.js';
import { identityApi } from '../api/endpoints/identityApi.js';
import { mapVehicleDto } from '../utils/mapVehicle.js';
import { mapComplaintDto } from '../utils/mapComplaint.js';
import { mapAlertDto, mapAlertRuleDto } from '../utils/mapAlert.js';
import { useResource } from '../hooks/useResource.js';
import { ApiError } from '../api/httpClient.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ---------- navigation ---------- */
  const [view, setView] = useState('dash');

  /* ---------- référentiels ---------- */
  const fetchVehicles = useCallback(
    () => fleetApi.getVehicles().then((list) => list.map(mapVehicleDto)),
    []
  );
  const { data: vehicles, refetch: refetchVehicles } = useResource(fetchVehicles, {
    initialData: [],
  });

  const { data: vehicleTypes } = useResource(useCallback(() => fleetApi.getVehicleTypes(), []), {
    initialData: [],
  });

  const vehiclesByBackendId = useMemo(() => new Map(vehicles.map((v) => [v._backendId, v])), [vehicles]);

  const fetchComplaints = useCallback(
    () => citizenApi.getComplaints().then((list) => list.map((dto) => mapComplaintDto(dto, vehiclesByBackendId))),
    [vehiclesByBackendId]
  );
  const { data: complaints, refetch: refetchComplaints } = useResource(fetchComplaints, { initialData: [] });

  const fetchAlerts = useCallback(
    () => alertingApi.getAlerts().then((list) => list.map((dto) => mapAlertDto(dto, vehiclesByBackendId))),
    [vehiclesByBackendId]
  );
  const { data: alerts, refetch: refetchAlerts } = useResource(fetchAlerts, { initialData: [] });

  const fetchRules = useCallback(
    () => alertingApi.getAlertRules().then((list) => list.map(mapAlertRuleDto)),
    []
  );
  const { data: rules, refetch: refetchRules } = useResource(fetchRules, { initialData: [] });

  const { data: drivers, refetch: refetchDrivers } = useResource(useCallback(() => fleetApi.getDrivers(), []), {
    initialData: [],
  });

  const { data: complaintCategories, refetch: refetchComplaintCategories } = useResource(
    useCallback(() => citizenApi.getComplaintCategories(), []),
    { initialData: [] }
  );

  const { data: users, refetch: refetchUsers } = useResource(useCallback(() => identityApi.getUsers(), []), {
    initialData: [],
  });

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
    async (form) => {
      const code = form.id.trim() || `BN-${10 + vehicles.length}`;
      const plate = form.plate.trim() || '0000-A-6';
      const vehicleType = vehicleTypes.find((t) => t.label === form.type);
      try {
        await fleetApi.createVehicle({
          code,
          plateNumber: plate,
          vehicleTypeId: vehicleType?.id,
          zone: null,
          imeiTracker: form.imei.trim() || null,
          flespiIdent: null,
        });
        await refetchVehicles();
        showToast(`Véhicule ${code} ajouté au référentiel`);
        return code;
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la création du véhicule');
        throw err;
      }
    },
    [vehicles.length, vehicleTypes, refetchVehicles, showToast]
  );

  const changeVehicleStatus = useCallback(
    async (backendId, status) => {
      try {
        await fleetApi.changeVehicleStatus(backendId, status);
        await refetchVehicles();
        showToast('Statut du véhicule mis à jour');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la mise à jour du statut');
      }
    },
    [refetchVehicles, showToast]
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
  const markAlertRead = useCallback(
    async (backendId) => {
      try {
        await alertingApi.markAlertRead(backendId);
        await refetchAlerts();
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec du marquage de l’alerte');
      }
    },
    [refetchAlerts, showToast]
  );

  const markAllRead = useCallback(async () => {
    try {
      await alertingApi.markAllAlertsRead();
      await refetchAlerts();
      showToast('Toutes les alertes marquées comme lues');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Échec du marquage des alertes');
    }
  }, [refetchAlerts, showToast]);

  const unreadCount = useMemo(() => alerts.filter((a) => a.unread).length, [alerts]);

  /* ---------- actions règles ---------- */
  const setRuleValue = useCallback(
    async (index, val) => {
      const rule = rules[index];
      if (!rule) return;
      try {
        await alertingApi.updateAlertRuleThreshold(rule._backendId, Number(val));
        await refetchRules();
        showToast('Seuil mis à jour');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la mise à jour du seuil');
      }
    },
    [rules, refetchRules, showToast]
  );

  const toggleRule = useCallback(
    async (index) => {
      const rule = rules[index];
      if (!rule) return;
      try {
        await alertingApi.toggleAlertRule(rule._backendId, !rule.on);
        await refetchRules();
        showToast(!rule.on ? 'Règle activée' : 'Règle désactivée');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la mise à jour de la règle');
      }
    },
    [rules, refetchRules, showToast]
  );

  // Canaux par règle : pas d'équivalent backend (AlertRuleDto n'expose pas de canaux par règle),
  // reste piloté localement en attendant un éventuel besoin produit confirmé.
  const toggleRuleChannel = useCallback((index, channel) => {
    showToast('Canaux par règle non connectés au backend (maquette)');
  }, [showToast]);

  const toggleChannel = useCallback((id) => {
    setChannels((list) => list.map((c) => (c.id === id ? { ...c, on: !c.on } : c)));
  }, []);

  /* ---------- réclamations ---------- */
  const openComplaints = useMemo(() => complaints.filter((c) => c.status !== 'Résolue'), [complaints]);

  const assignComplaintVehicle = useCallback(
    async (backendId, vehicleBackendId) => {
      try {
        await citizenApi.assignComplaint(backendId, vehicleBackendId);
        await refetchComplaints();
        showToast('Véhicule affecté à la réclamation');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de l’affectation');
      }
    },
    [refetchComplaints, showToast]
  );

  const resolveComplaint = useCallback(
    async (backendId, photoAfterUrl = null) => {
      try {
        await citizenApi.resolveComplaint(backendId, photoAfterUrl);
        await refetchComplaints();
        showToast('Réclamation résolue');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la clôture');
      }
    },
    [refetchComplaints, showToast]
  );

  /* ---------- chauffeurs ---------- */
  const addDriver = useCallback(
    async (form) => {
      try {
        await fleetApi.createDriver({ fullName: form.fullName, phone: form.phone || null, licenceNumber: form.licenceNumber || null });
        await refetchDrivers();
        showToast(`Chauffeur ${form.fullName} ajouté au référentiel`);
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la création du chauffeur');
      }
    },
    [refetchDrivers, showToast]
  );

  const changeDriverStatus = useCallback(
    async (backendId, status) => {
      try {
        await fleetApi.changeDriverStatus(backendId, status);
        await refetchDrivers();
        showToast('Statut du chauffeur mis à jour');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la mise à jour du statut');
      }
    },
    [refetchDrivers, showToast]
  );

  /* ---------- catégories de réclamation ---------- */
  const addComplaintCategory = useCallback(
    async (form) => {
      try {
        await citizenApi.createComplaintCategory({
          label: form.label,
          icon: form.icon || null,
          defaultPriority: form.defaultPriority,
          slaHours: Number(form.slaHours),
        });
        await refetchComplaintCategories();
        showToast(`Catégorie ${form.label} ajoutée`);
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la création de la catégorie');
      }
    },
    [refetchComplaintCategories, showToast]
  );

  const toggleComplaintCategoryActive = useCallback(
    async (backendId, isActive) => {
      try {
        await citizenApi.setComplaintCategoryActive(backendId, isActive);
        await refetchComplaintCategories();
        showToast(isActive ? 'Catégorie activée' : 'Catégorie désactivée');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la mise à jour de la catégorie');
      }
    },
    [refetchComplaintCategories, showToast]
  );

  /* ---------- utilisateurs ---------- */
  const addUser = useCallback(
    async (form) => {
      try {
        await identityApi.createUser({
          email: form.email,
          fullName: form.fullName,
          password: form.password,
          role: form.role,
          scope: form.scope || null,
          cityId: form.cityId || null,
        });
        await refetchUsers();
        showToast(`Utilisateur ${form.fullName} invité`);
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la création de l’utilisateur');
      }
    },
    [refetchUsers, showToast]
  );

  const toggleUserActive = useCallback(
    async (userId, isActive) => {
      try {
        await identityApi.setUserActive(userId, isActive);
        await refetchUsers();
        showToast(isActive ? 'Utilisateur activé' : 'Utilisateur désactivé');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'Échec de la mise à jour de l’utilisateur');
      }
    },
    [refetchUsers, showToast]
  );

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
    vehicleTypes,
    addVehicle,
    changeVehicleStatus,
    drivers,
    addDriver,
    changeDriverStatus,
    complaints,
    openComplaints,
    assignComplaintVehicle,
    resolveComplaint,
    complaintCategories,
    addComplaintCategory,
    toggleComplaintCategoryActive,
    users,
    addUser,
    toggleUserActive,
    alerts,
    unreadCount,
    markAlertRead,
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
