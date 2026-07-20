// Traduit un VehicleDto backend (PascalCase→camelCase déjà fait par le JSON) vers la forme
// consommée par VehicleList/VehicleDetail/LiveMap.
export function mapVehicleDto(dto) {
  return {
    id: dto.code,
    _backendId: dto.id,
    plate: dto.plateNumber,
    type: dto.vehicleTypeLabel,
    driver: dto.driverName,
    zone: dto.zone,
    status: dto.status?.toLowerCase(),
    speed: dto.speedKmh,
    distToday: dto.distanceTodayKm,
    drive: dto.driveTimeToday ?? '—',
    lastStop: dto.lastStopLabel ?? '—',
    imei: dto.imeiTracker ?? '—',
    flespiIdent: dto.flespiIdent,
    lastKnownLat: dto.lastKnownLat,
    lastKnownLng: dto.lastKnownLng,
    cityId: dto.cityId,
    // Fallback si aucune position GPS connue (jamais reçu de fix) — centre Casablanca.
    route: [[-7.6, 33.57], [-7.6, 33.57]],
  };
}
