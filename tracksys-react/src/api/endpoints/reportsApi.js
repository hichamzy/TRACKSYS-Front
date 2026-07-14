import { httpClient } from '../httpClient.js';

export const reportsApi = {
  getKpis: () => httpClient.get('/api/reports/kpis'),
  getDistanceSeries: () => httpClient.get('/api/reports/distance-series'),
  getResolutionSeries: () => httpClient.get('/api/reports/resolution-series'),
  getTypes: () => httpClient.get('/api/reports/types'),
  getSaved: () => httpClient.get('/api/reports/saved'),
  saveReport: (body) => httpClient.post('/api/reports/saved', body),
};
