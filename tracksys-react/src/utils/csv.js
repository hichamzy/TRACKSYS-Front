/**
 * Export « Excel » = CSV UTF-8 avec BOM, séparateur point-virgule (ouverture directe dans Excel FR).
 * @param {string} filename
 * @param {Array<Array<string|number>>} rows
 */
export function exportCSV(filename, rows) {
  const csv =
    '\uFEFF' +
    rows
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Retire les balises des libellés d'alerte (détail en segments) */
export const plainDetail = (segments) => segments.map((s) => s.t).join('');
