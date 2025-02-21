export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface StatusData {
  id: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface MetricsResponse {
  metrics: TimeSeriesData[];
  status: StatusData[];
}

export interface MetricsError {
  message: string;
  code?: string;
}

export type TimeRange = 'hour' | 'day' | 'week';

export interface MetricsState {
  metrics: TimeSeriesData[];
  status: StatusData[];
  isLoading: boolean;
  error: MetricsError | null;
  timeRange: TimeRange;
}
