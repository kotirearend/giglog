export function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  const dateOnly = String(dateStr).split('T')[0];
  const date = new Date(dateOnly + 'T12:00:00');
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateCompact(dateStr) {
  if (!dateStr) return '';
  const dateOnly = String(dateStr).split('T')[0];
  const [y, m, d] = dateOnly.split('-');
  return `${d}.${m}.${y.slice(2)}`;
}

export function formatDayName(dateStr) {
  if (!dateStr) return '';
  const dateOnly = String(dateStr).split('T')[0];
  const date = new Date(dateOnly + 'T12:00:00');
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
}

export function formatCurrency(amount) {
  return `£${Number(amount).toFixed(2)}`;
}

export function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 65%, 55%)`;
}
