import { TimeSeriesData, StatusUpdate } from '../types';

export const createMockTimeSeriesData = (count: number): TimeSeriesData[] => {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(2024, 0, 1, i).toISOString(),
    value: Math.random() * 100,
  }));
};

export const createMockStatusUpdates = (count: number): StatusUpdate[] => {
  const statuses = ['healthy', 'warning', 'error'] as const;
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    status: statuses[i % statuses.length],
    message: `Test message ${i + 1}`,
    timestamp: new Date(2024, 0, 1, i).toISOString(),
  }));
};