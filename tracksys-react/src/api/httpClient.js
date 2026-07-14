// Client HTTP unique : URL de base, JWT en mémoire, retry automatique sur 401 (un seul essai).
// L'access token vit uniquement en mémoire (jamais localStorage) — voir AuthContext.jsx.

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let accessToken = null;
let onAuthFailure = null; // callback injecté par AuthContext (déconnexion propre, pas de reload dur)
let refreshFn = null; // () => Promise<boolean> injecté par AuthContext

export function setAccessToken(token) {
  accessToken = token;
}

export function configureAuthHooks({ onFailure, refresh }) {
  onAuthFailure = onFailure;
  refreshFn = refresh;
}

export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request(path, { method = 'GET', body, skipAuthRetry = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !skipAuthRetry && refreshFn) {
    const refreshed = await refreshFn();
    if (refreshed) return request(path, { method, body, skipAuthRetry: true });
    onAuthFailure?.();
    throw new ApiError(401, 'Session expirée.', null);
  }

  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {
      /* pas de corps JSON */
    }
    throw new ApiError(res.status, payload?.error || res.statusText, payload);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const httpClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
