"use client";

import { useTimeRange } from '../hooks/useTimeRange';
import { useMetricsData } from '../hooks/useMetricData';
import Loading from "./generics/Loading";
import ErrorBoundary from "./ErrorBoundary";
import MetricsChart from "./MetricsChart";
import StatusList from "./StatusList";
import TimeRangeSelector from "./TimeRangeSelector";

export default function MetricsDashboard() {
  const { timeRange, setTimeRange } = useTimeRange();
  const { metrics, status, loading, error } = useMetricsData(timeRange);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Metrics Dashboard</h1>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl mb-4">Performance Metrics</h2>
            <MetricsChart data={metrics} />
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl mb-4">System Status</h2>
            <StatusList updates={status} />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}