import { useState } from 'react';
import type { TimeRange } from '../types';

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