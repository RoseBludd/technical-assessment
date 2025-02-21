"use server";

import { formatTimestamp } from "@/lib/utils";
import { ChartConfig } from "../ui/chart";
import CustomLineChart from "../custom-line-chart/CustomLineChart";

const URL_WHERE_TO_FETCH_DATA = "http://localhost:3000";

export default async function MetricsDataOne() {
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
    <CustomLineChart
      chartConfig={chartConfig}
      data={formatedMetrics}
      xKey="timestamp"
      yKey="value"
    />
  );
}
