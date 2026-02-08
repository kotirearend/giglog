export function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  // Handle both "2026-02-08" and "2026-02-08T00:00:00.000Z" formats
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

export function formatCurrency(amount) {
  return `£${Number(amount).toFixed(2)}`;
}

export function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 30%)`;
}
