// Reverse geocoding via Nominatim (OpenStreetMap) — gratuit, sans clé API.
// Respecte la limite d'usage public (1 req/s) via une file d'attente séquentielle,
// et met les résultats en cache pour ne jamais interroger deux fois le même point.

const cache = new Map();
let queue = Promise.resolve();

function keyOf(lat, lng) {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

function extractStreet(data) {
  const a = data?.address || {};
  return a.road || a.pedestrian || a.footway || a.neighbourhood || a.suburb || null;
}

/** Résout lat/lng vers un nom de rue OSM. Retourne `fallback` en cas d'échec ou d'absence de résultat. */
export function reverseGeocode(lat, lng, fallback = null) {
  const key = keyOf(lat, lng);
  if (cache.has(key)) return Promise.resolve(cache.get(key) ?? fallback);

  const run = () =>
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=17`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const street = extractStreet(data);
        cache.set(key, street);
        return street ?? fallback;
      })
      .catch(() => fallback);

  // Chaîne les appels pour respecter ~1 req/s, sans bloquer les lectures déjà en cache
  const result = queue.then(() => new Promise((resolve) => setTimeout(() => run().then(resolve), 1100)));
  queue = result.catch(() => {});
  return result;
}
