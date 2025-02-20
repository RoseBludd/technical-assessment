"use client";

import { useState, useEffect } from "react";
import { TimeSeriesData, StatusUpdate, fetchMetrics, fetchStatus } from "../../api/mock-data";
import Loading from "./generics/Loading";
import ErrorBoundary from "../components/ErrorBoundary";
import MetricsChart from "../components/MetricsChart";
import StatusList from "../components/StatusList";
import TimeRangeSelector from "../components/TimeRangeSelector";

export type TimeRange = "hour" | "day" | "week";

export default function MetricsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [metrics, setMetrics] = useState<TimeSeriesData[]>([]);
  const [status, setStatus] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [metricsData, statusData] = await Promise.all([
          fetchMetrics(timeRange),
          fetchStatus()
        ]);
        
        setMetrics(metricsData);
        setStatus(statusData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

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