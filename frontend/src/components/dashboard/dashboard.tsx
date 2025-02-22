import { fetchMetrics, fetchStatus, StatusUpdate } from "@/api/mock-data";
import { MetricsChart } from "./metrics-chart";
import StatusCard from "./status-card";

export default async function Dashboard() {
  const data = await fetchMetrics();
  const status = await fetchStatus();

  console.log("Metrics data >> ", data);
  console.log("Status >> ", status);

  return (
    <div className="w-full flex gap-4 flex-col">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {status.map((stat: StatusUpdate) => (
          <StatusCard
            key={stat.id}
            status={stat.status}
            message={stat.message}
            timestamp={stat.timestamp}
          />
        ))}
      </div>

      <MetricsChart data={data} />
    </div>
  );
}
