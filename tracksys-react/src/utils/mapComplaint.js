// Traduit un ComplaintDto backend vers la forme consommée par ComplaintsView/ComplaintModal/LiveMap.
const STATUS_LABEL = {
  Received: 'Reçue',
  InProgress: 'En cours',
  Resolved: 'Résolue',
};

function formatReportedDate(isoUtc) {
  if (!isoUtc) return '—';
  const d = new Date(isoUtc);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return sameDay ? `Aujourd'hui ${time}` : `${d.toLocaleDateString('fr-FR')} ${time}`;
}

export function mapComplaintDto(dto, vehiclesByBackendId) {
  return {
    id: dto.code,
    _backendId: dto.id,
    type: dto.categoryLabel,
    categoryId: dto.categoryId,
    zone: dto.zoneLabel,
    prio: dto.priority,
    status: STATUS_LABEL[dto.status] ?? dto.status,
    assign: dto.assignedVehicleId != null ? (vehiclesByBackendId?.get(dto.assignedVehicleId)?.id ?? null) : null,
    time: dto.reportedAtUtc,
    date: formatReportedDate(dto.reportedAtUtc),
    lng: Number(dto.lng),
    lat: Number(dto.lat),
    photoBeforeUrl: dto.photoBeforeUrl,
    photoAfterUrl: dto.photoAfterUrl,
  };
}
