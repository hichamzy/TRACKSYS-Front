import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { identityApi } from '../api/endpoints/identityApi.js';
import { setAccessToken, configureAuthHooks, ApiError } from '../api/httpClient.js';

const AuthContext = createContext(null);

const REFRESH_TOKEN_KEY = 'tracksys.refreshToken';

function userFromAuthResponse(res) {
  return { userId: res.userId, email: res.email, fullName: res.fullName, roles: res.roles };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [refreshToken, setRefreshTokenState] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const persistSession = useCallback((authResponse) => {
    setAccessToken(authResponse.accessToken);
    setRefreshTokenState(authResponse.refreshToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
    setUser(userFromAuthResponse(authResponse));
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setRefreshTokenState(null);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await identityApi.login(email, password);
      persistSession(res);
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    const stored = localStorage.getItem(REFRESH_TOKEN_KEY);
    clearSession();
    if (stored) {
      try {
        await identityApi.logout(stored);
      } catch {
        /* déconnexion locale déjà effective, l'échec réseau n'est pas bloquant */
      }
    }
  }, [clearSession]);

  const silentRefresh = useCallback(async () => {
    const stored = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!stored) return false;
    try {
      const res = await identityApi.refresh(stored);
      persistSession(res);
      return true;
    } catch (err) {
      if (err instanceof ApiError) clearSession();
      return false;
    }
  }, [persistSession, clearSession]);

  // Rafraîchissement silencieux au démarrage — restaure la session sans repasser par le login
  useEffect(() => {
    (async () => {
      await silentRefresh();
      setIsBootstrapping(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Branche httpClient sur ce contexte : retry 401 -> silentRefresh, échec -> déconnexion propre
  useEffect(() => {
    configureAuthHooks({ onFailure: clearSession, refresh: silentRefresh });
  }, [clearSession, silentRefresh]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isBootstrapping,
      login,
      logout,
    }),
    [user, isBootstrapping, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l’intérieur de <AuthProvider>');
  return ctx;
}
