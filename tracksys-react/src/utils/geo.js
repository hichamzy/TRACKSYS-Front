/** Distance euclidienne entre deux points [x,y] */
export const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Longueurs de segments + longueur totale d'une polyligne */
export function measureRoute(route) {
  const segLen = [];
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const l = dist(route[i], route[i + 1]);
    segLen.push(l);
    total += l;
  }
  return { segLen, total };
}

/** Point situé à la progression p (0→1) le long de la polyligne */
export function pointAt(route, segLen, total, p) {
  let d = Math.max(0, Math.min(1, p)) * total;
  for (let i = 0; i < segLen.length; i++) {
    if (d <= segLen[i] || i === segLen.length - 1) {
      const t = segLen[i] ? d / segLen[i] : 0;
      const a = route[i];
      const b = route[i + 1];
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    d -= segLen[i];
  }
  return route[route.length - 1];
}

/** minutes → "HH:MM" */
export function fmtMin(m) {
  const h = Math.floor(m / 60);
  const mm = Math.round(m % 60);
  return String(h).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

/** "HH:MM" → minutes */
export function parseHM(t) {
  const [a, b] = t.split(':').map(Number);
  return a * 60 + b;
}
