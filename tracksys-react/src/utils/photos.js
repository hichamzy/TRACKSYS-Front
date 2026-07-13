// Photos « avant / après » simulées : SVG inline en data-URI (aucune image externe requise).

export function avantImg(type = '') {
  const c = type.includes('Dépôt')
    ? '%23c9b79a'
    : type.includes('Bac')
    ? '%23a7b8a0'
    : type.includes('clairage')
    ? '%23b3aec4'
    : '%23b0b6bd';

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='170'><rect width='260' height='170' fill='${c}'/><rect y='120' width='260' height='50' fill='%237e8ca0'/><rect x='24' y='70' width='46' height='50' fill='%238b7355'/><rect x='90' y='84' width='40' height='36' fill='%23707d8c'/><rect x='150' y='62' width='54' height='58' fill='%236f6152'/><rect x='210' y='92' width='34' height='28' fill='%23837059'/></svg>`;
}

export function apresImg() {
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='170'><rect width='260' height='170' fill='%23dfefe4'/><rect y='120' width='260' height='50' fill='%23a9c3b0'/><rect x='24' y='60' width='44' height='60' fill='%23bcd0c2'/><rect x='150' y='54' width='50' height='66' fill='%23b2caba'/><circle cx='120' cy='40' r='16' fill='%23f2d98a'/><rect x='96' y='100' width='60' height='20' rx='4' fill='%2388a794'/></svg>`;
}
