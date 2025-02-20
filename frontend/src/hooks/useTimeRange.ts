import { useState } from 'react';
import type { TimeRange } from '../types';

// Hook to handle the time range, it's used in the MetricsDashboard component

export function useTimeRange(initialRange: TimeRange = 'day') {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialRange);

  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
  };

  return {
    timeRange,
    setTimeRange: handleTimeRangeChange,
  };
}