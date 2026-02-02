/** Fisher-Yates shuffle (returns new array) */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Pick n random items from array (without replacement) */
export function randomSample<T>(array: T[], n: number): T[] {
  return shuffle(array).slice(0, n);
}

/** Format a unix timestamp as a relative date string */
export function formatRelativeDate(timestamp: number): string {
  if (timestamp === 0) return "Never";
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(timestamp);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

/** Format a unix timestamp as a short date */
export function formatDate(timestamp: number): string {
  if (timestamp === 0) return "Never";
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Get the start of today in local timezone as unix timestamp */
export function startOfToday(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

/** Get the calendar date string (YYYY-MM-DD) for a timestamp in local timezone */
export function toDateKey(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Generate a composite ReviewCard ID */
export function reviewCardId(
  dataSetId: string,
  itemId: string,
  direction: string,
): string {
  return `${dataSetId}::${itemId}::${direction}`;
}
