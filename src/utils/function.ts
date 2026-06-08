export const formatDateDisplay = (date: string | Date | null | undefined): string => {
  // Return empty for null, undefined, or empty string
  if (date === null || date === undefined || date === "") return "";

  let d: Date;
  if (typeof date === "string") {
    d = new Date(date);
  }
  else if (date instanceof Date) {
    d = date;
  }
  else {
    return String(date);
  }
  if (isNaN(d.getTime())) return String(date);

  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDateTime = (timestamp: number | null | undefined): string => {
  if (!timestamp) return 'Never';

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};