import { useMemo } from 'react';
import type { TimeSeriesData } from '../types';
import { formatTime } from '../utils';

export function useChartData(data: TimeSeriesData[]) {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedTime: formatTime(item.timestamp)
    }));
  }, [data]);

  return formattedData;
}