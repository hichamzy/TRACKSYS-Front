// Traduit une liste de PositionDto backend (points GPS bruts, triés par device_ts) vers la
// forme consommée par HistoryMap/TripPlayer/StopList — uniquement position/vitesse/horodatage,
// jamais de circuit/planning (concept absent de l'historique, décision produit).
const STOP_SPEED_THRESHOLD_KMH = 3;
const MIN_STOP_GAP_MINUTES = 5;

function minutesOfDay(isoUtc) {
  const d = new Date(isoUtc);
  return d.getHours() * 60 + d.getMinutes();
}

function hm(isoUtc) {
  const d = new Date(isoUtc);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function mapTripHistory(positions) {
  if (!positions.length) {
    return { route: [], stops: [], startMin: 0, durMin: 0 };
  }

  const sorted = [...positions].sort((a, b) => new Date(a.deviceTsUtc) - new Date(b.deviceTsUtc));
  const route = sorted.map((p) => [p.longitude, p.latitude]);

  const stops = [];
  let lastStopMinutes = -Infinity;

  sorted.forEach((p, i) => {
    const isFirst = i === 0;
    const isLast = i === sorted.length - 1;
    const isSlow = (p.positionSpeed ?? 0) <= STOP_SPEED_THRESHOLD_KMH;
    const minutes = minutesOfDay(p.deviceTsUtc);

    if (isFirst) {
      stops.push({ lng: p.longitude, lat: p.latitude, t: hm(p.deviceTsUtc), n: 'Départ', type: 'start' });
      lastStopMinutes = minutes;
      return;
    }
    if (isLast) {
      stops.push({ lng: p.longitude, lat: p.latitude, t: hm(p.deviceTsUtc), n: 'Arrivée', type: 'end' });
      return;
    }
    if (isSlow && minutes - lastStopMinutes >= MIN_STOP_GAP_MINUTES) {
      stops.push({ lng: p.longitude, lat: p.latitude, t: hm(p.deviceTsUtc), n: `Point GPS ${hm(p.deviceTsUtc)}` });
      lastStopMinutes = minutes;
    }
  });

  const startMin = minutesOfDay(sorted[0].deviceTsUtc);
  const endMin = minutesOfDay(sorted[sorted.length - 1].deviceTsUtc);

  return { route, stops, startMin, durMin: Math.max(1, endMin - startMin) };
}
