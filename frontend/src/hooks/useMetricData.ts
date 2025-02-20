import { useState, useEffect } from 'react';
import { fetchMetrics, fetchStatus } from '../../api/mock-data';
import type { TimeRange, MetricsDataState } from '../types';


// Hook to fetch the metrics and status data, it's used in the MetricsDashboard component
export function useMetricsData(timeRange: TimeRange) {
  const [state, setState] = useState<MetricsDataState>({
    metrics: [],
    status: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const [metricsData, statusData] = await Promise.all([
          fetchMetrics(timeRange),
          fetchStatus()
        ]);
        
        setState({
          metrics: metricsData,
          status: statusData,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch data"
        }));
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  return state;
}