export function deriveGigDate(timestamp) {
  const date = new Date(timestamp);
  if (date.getHours() < 10) {
    date.setDate(date.getDate() - 1);
  }
  return date.toISOString().split('T')[0];
}

export function deriveGigTime(timestamp) {
  return new Date(timestamp).toTimeString().slice(0, 5);
}
