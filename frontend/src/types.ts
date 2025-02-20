export type TimeSeries = {
  timestamp: string;
  value: number;
};

export type StatusUpdate = {
  id: string;
  status: "healthy" | "warning" | "error";
  message: string;
  timestamp: string;
};

export type TimeRange = "hour" | "day" | "week";
