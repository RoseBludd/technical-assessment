import { useMemo } from 'react';
import type { TimeSeriesData } from '../types';
import { formatTime } from '../utils';

// Hook to format the data for the chart, it's used in the MetricsDashboard component

export function useChartData(data: TimeSeriesData[]) {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedTime: formatTime(item.timestamp)
    }));
  }, [data]);

  return formattedData;
}