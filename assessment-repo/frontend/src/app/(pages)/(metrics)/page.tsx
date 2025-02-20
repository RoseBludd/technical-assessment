import { fetchMetrics } from "@/api/mock-data";
import PageTemplate from "@/components/templates/PageTemplate";
import MetricsTable from "./components/MetricsTable";

const Metrics = async () => {
  const metricsData = await fetchMetrics();
  return (
    <PageTemplate title="Metrics">
      <MetricsTable metricsData={metricsData} />
    </PageTemplate>
  );
};

export default Metrics;
