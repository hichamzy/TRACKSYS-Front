import { httpClient } from '../httpClient.js';

export const tenancyApi = {
  getCities: () => httpClient.get('/api/tenancy/cities'),
  getCity: (id) => httpClient.get(`/api/tenancy/cities/${id}`),
  createCity: (body) => httpClient.post('/api/tenancy/cities', body),
  updateCity: (id, body) => httpClient.put(`/api/tenancy/cities/${id}`, body),
};
