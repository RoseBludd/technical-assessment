"use server";

import { formatTimestamp } from "@/lib/utils";
import { ChartConfig } from "../ui/chart";
import CustomAreaChart from "../custom-area-chart/CustomAreaChart";

const URL_WHERE_TO_FETCH_DATA = "http://localhost:3000";

export default async function MetricsDataThree() {
  const response = await fetch(`${URL_WHERE_TO_FETCH_DATA}/api/metrics`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const metrics = await response.json();

  const formatedMetrics = metrics.map((metric) => {
    metric.timestamp = formatTimestamp(metric.timestamp);
    return metric;
  });

  const chartConfig = {
    value: {
      label: "value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <CustomAreaChart
      chartConfig={chartConfig}
      data={formatedMetrics}
      xKey="timestamp"
      yKey="value"
    />
  );
}
