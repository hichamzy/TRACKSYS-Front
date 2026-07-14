import { httpClient } from '../httpClient.js';

export const citizenApi = {
  getComplaints: () => httpClient.get('/api/citizen/complaints'),
  getComplaintCategories: () => httpClient.get('/api/citizen/complaint-categories'),
  getComplaintCategoryBreakdown: () => httpClient.get('/api/citizen/complaints/category-breakdown'),
  assignComplaint: (id, vehicleId) => httpClient.put(`/api/citizen/complaints/${id}/assign`, { vehicleId }),
  resolveComplaint: (id, photoAfterUrl) => httpClient.put(`/api/citizen/complaints/${id}/resolve`, { photoAfterUrl }),

  createComplaintCategory: (body) => httpClient.post('/api/citizen/complaint-categories', body),
  updateComplaintCategory: (id, body) => httpClient.put(`/api/citizen/complaint-categories/${id}`, body),
  setComplaintCategoryActive: (id, isActive) =>
    httpClient.put(`/api/citizen/complaint-categories/${id}/active`, { isActive }),
};
