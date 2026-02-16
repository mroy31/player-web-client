export function FormatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formatNumber = (num: number): string => num.toString().padStart(2, "0");

  if (hours > 0) {
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(secs)}`;
  }
  return `${formatNumber(minutes)}:${formatNumber(secs)}`;
}

export function UnixToDate(timestamp: number): string {
  if (timestamp === 0) return "Nerver played";

  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `Player at ${day}-${month}-${year}`;
}
