import { relativeTimeFromUtc } from './relativeTime.js';

// Traduit un AlertDto backend vers la forme consommée par AlertList/AlertsView.
// `det` (segments gras) n'a pas d'équivalent backend — simplifié en un seul segment non gras
// (le mock supportait plusieurs segments, simplification assumée — voir plan Phase 2).
export function mapAlertDto(dto, vehiclesByBackendId) {
  return {
    id: dto.code,
    _backendId: dto.id,
    k: dto.alertTypeCode,
    veh: vehiclesByBackendId?.get(dto.vehicleId)?.id ?? String(dto.vehicleId),
    det: [{ t: dto.detailText }],
    time: relativeTimeFromUtc(dto.occurredAtUtc),
    unread: dto.isUnread,
  };
}

// Traduit un AlertRuleDto backend vers la forme consommée par RuleList.
// `channels` (app/mail/sms par règle) n'a pas d'équivalent backend — reste piloté par les
// canaux globaux (INITIAL_CHANNELS, toujours mock, hors scope Phase 2).
export function mapAlertRuleDto(dto) {
  return {
    _backendId: dto.id,
    k: dto.alertTypeCode,
    on: dto.isEnabled,
    val: dto.threshold,
    unit: dto.unit,
    d: dto.description ?? '',
    channels: { app: true, mail: true, sms: false },
  };
}
