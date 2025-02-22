import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeStamp(timestamp) {
  const date = new Date(timestamp);
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    hour: "numeric",
    hour12: true,
  });
  return formatter.format(date);
}
