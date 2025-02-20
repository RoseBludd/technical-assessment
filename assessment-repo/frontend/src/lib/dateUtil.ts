export const formatTimestamp = (
  timestamp: string,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }
): string => {
  return new Intl.DateTimeFormat(locale, options).format(new Date(timestamp));
};
