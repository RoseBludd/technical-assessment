import { useState, useEffect } from 'react';
import { fetchMetrics, fetchStatus } from '@/lib/mock-data';
import type {
  TimeSeriesData,
  StatusData,
  TimeRange,
  MetricsError,
} from '@/types/metrics';

const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

export function useMetrics(timeRange: TimeRange = 'day') {
  const [metrics, setMetrics] = useState<TimeSeriesData[]>([]);
  const [status, setStatus] = useState<StatusData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<MetricsError | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  async function fetchWithRetry(
    fn: () => Promise<any>,
    retries: number = RETRY_COUNT
  ) {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(fn, retries - 1);
      }
      throw err;
    }
  }

  const fetchData = async (showFullLoading = true) => {
    try {
      if (showFullLoading) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const [metricsData, statusData] = await Promise.all([
        fetchMetrics(timeRange),
        fetchStatus(),
      ]);

      setMetrics(metricsData);
      setStatus(statusData);
      setError(null);
    } catch (err) {
      setError({
        message: 'Failed to fetch metrics data',
        code: 'FETCH_ERROR',
      });
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchData(false);
  }, [timeRange]);

  return {
    metrics,
    status,
    isLoading,
    isRefetching,
    error,
    refetch: () => fetchData(true),
  };
}
