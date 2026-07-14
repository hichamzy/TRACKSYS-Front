import { httpClient } from '../httpClient.js';

export const alertingApi = {
  getAlerts: () => httpClient.get('/api/alerting/alerts'),
  getAlertTypes: () => httpClient.get('/api/alerting/alert-types'),
  getAlertRules: () => httpClient.get('/api/alerting/alert-rules'),
  markAlertRead: (id) => httpClient.put(`/api/alerting/alerts/${id}/read`),
  markAllAlertsRead: () => httpClient.put('/api/alerting/alerts/read-all'),
  updateAlertRuleThreshold: (id, threshold) => httpClient.put(`/api/alerting/alert-rules/${id}/threshold`, { threshold }),
  toggleAlertRule: (id, enabled) => httpClient.put(`/api/alerting/alert-rules/${id}/toggle`, { enabled }),
};
