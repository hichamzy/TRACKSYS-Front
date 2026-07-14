/** Initiales à partir d'un nom complet, ex. "A. Tarhine" -> "AT" */
export function initialsFromName(fullName = '') {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.replace('.', '')[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
