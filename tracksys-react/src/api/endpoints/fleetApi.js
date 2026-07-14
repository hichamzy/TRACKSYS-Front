import { httpClient } from '../httpClient.js';

export const fleetApi = {
  getVehicles: () => httpClient.get('/api/fleet/vehicles'),
  getVehicleTypes: () => httpClient.get('/api/fleet/vehicle-types'),
  createVehicle: (body) => httpClient.post('/api/fleet/vehicles', body),
  changeVehicleStatus: (id, status) => httpClient.put(`/api/fleet/vehicles/${id}/status`, { status }),
  assignVehicleDriver: (id, driverId) => httpClient.put(`/api/fleet/vehicles/${id}/driver`, { driverId }),

  getDrivers: () => httpClient.get('/api/fleet/drivers'),
  createDriver: (body) => httpClient.post('/api/fleet/drivers', body),
  changeDriverStatus: (id, status) => httpClient.put(`/api/fleet/drivers/${id}/status`, { status }),
  assignDriverVehicle: (id, vehicleId) => httpClient.put(`/api/fleet/drivers/${id}/vehicle`, { vehicleId }),
};
