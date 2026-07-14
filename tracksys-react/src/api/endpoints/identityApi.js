import { httpClient } from '../httpClient.js';

export const identityApi = {
  login: (email, password) => httpClient.post('/api/auth/login', { email, password }),
  refresh: (refreshToken) => httpClient.post('/api/auth/refresh', { refreshToken }),
  logout: (refreshToken) => httpClient.post('/api/auth/logout', { refreshToken }),

  getUsers: () => httpClient.get('/api/identity/users'),
  createUser: (body) => httpClient.post('/api/identity/users', body),
  changeUserRole: (id, role) => httpClient.put(`/api/identity/users/${id}/role`, { role }),
  setUserActive: (id, isActive) => httpClient.put(`/api/identity/users/${id}/active`, { isActive }),
};
