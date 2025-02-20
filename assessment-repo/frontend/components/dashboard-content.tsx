
import MetricsChart from '@/components/metrics-chart';
import StatusUpdates from '@/components/status-updates';
import { fetchMetrics, fetchStatus } from '@/api/mock-data';

const DashboardContent = async () => {

  

  //parallel data fetching 
  const [metricsHour, metricsDay, metricsWeek, statusUpdates] =
    await Promise.all([
      fetchMetrics('hour'),
      fetchMetrics('day'),
      fetchMetrics('week'),
      fetchStatus(),
    ]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">System Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Hour Metrics */}
        <div className="bg-card rounded-lg shadow-xl p-4">
          <MetricsChart data={metricsHour} label="Hourly" />
        </div>

        {/* Day Metrics */}
        <div className="bg-card rounded-lg shadow-xl p-4">
          <MetricsChart data={metricsDay} label="Daily" />
        </div>

        {/* Week Metrics */}
        <div className="bg-card rounded-lg shadow-xl p-4">
          <MetricsChart data={metricsWeek} label="Weekly" />
        </div>
      </div>

      {/* Status Updates Section */}
      <div className="bg-card rounded-lg shadow-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Status Updates</h2>
        <StatusUpdates updates={statusUpdates} />
      </div>
    </div>
  );
};

export default DashboardContent;