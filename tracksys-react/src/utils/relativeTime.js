// "il y a X min/h/j" à partir d'un ISO UTC — remplace les libellés figés du mock.
export function relativeTimeFromUtc(isoUtc) {
  if (!isoUtc) return '—';
  const diffMs = Date.now() - new Date(isoUtc).getTime();
  const minutes = Math.max(0, Math.round(diffMs / 60000));
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'hier' : `il y a ${days} j`;
}
