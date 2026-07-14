import { httpClient } from '../httpClient.js';

// Endpoint public (AllowAnonymous côté backend, décision produit) — pas de JWT requis.
export const positionsApi = {
  getLive: () => httpClient.get('/api/positions/live'),
  getHistory: (deviceId, fromUtc, toUtc) =>
    httpClient.get(
      `/api/positions/history?deviceId=${encodeURIComponent(deviceId)}&from=${encodeURIComponent(fromUtc)}&to=${encodeURIComponent(toUtc)}`
    ),
};
