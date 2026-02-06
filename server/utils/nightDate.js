export function deriveGigDate(localTimeISO) {
  const date = new Date(localTimeISO);
  const hours = date.getHours();
  if (hours < 10) {
    date.setDate(date.getDate() - 1);
  }
  return date.toISOString().split('T')[0];
}
