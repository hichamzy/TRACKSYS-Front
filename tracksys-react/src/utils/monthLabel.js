const SHORT_MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

// "2026-06" -> "Jun"
export function shortMonthLabel(yearMonth) {
  const [, month] = yearMonth.split('-');
  return SHORT_MONTHS[Number(month) - 1] ?? yearMonth;
}
