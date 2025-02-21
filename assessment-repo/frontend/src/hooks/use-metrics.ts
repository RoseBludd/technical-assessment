import { useState, useEffect } from 'react';
import { fetchMetrics, fetchStatus } from '@/lib/mock-data';
import type { TimeSeriesData, StatusData } from '@/types/metrics';

const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

export function useMetrics() {
  const [metrics, setMetrics] = useState<TimeSeriesData[]>([]);
  const [status, setStatus] = useState<StatusData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [metricsData, statusData] = await Promise.all([
          fetchWithRetry(() => fetchMetrics()),
          fetchWithRetry(() => fetchStatus()),
        ]);
        setMetrics(metricsData);
        setStatus(statusData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch data')
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { metrics, status, isLoading, error };
}
