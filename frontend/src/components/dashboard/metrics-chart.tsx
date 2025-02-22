"use client";
import { Bar, BarChart, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/ui/chart";
import { TimeSeriesData } from "@/api/mock-data";
import { formatTimeStamp } from "@/src/lib/utils";
import { useEffect, useState } from "react";

const chartConfig = {
  metrics: {
    label: "Metrics",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface TimeData {
  value: number;
  dayTime: string;
}

export function MetricsChart({ data }: { data: TimeSeriesData[] }) {
  const [timeSeries, setTimeSeries] = useState<TimeData[]>([]);
  const [timeRangeLabel, setTimeRangeLabel] = useState("");

  useEffect(() => {
    if (data.length > 0) {
      const metricsData: TimeData[] = data.map((timeData: TimeSeriesData) => {
        return {
          value: timeData.value,
          dayTime: formatTimeStamp(timeData.timestamp),
        };
      });

      setTimeSeries(metricsData);

      const startRange = formatTimeStamp(data[0].timestamp);
      const endRange = formatTimeStamp(data[data.length - 1].timestamp);
      setTimeRangeLabel(`${startRange} - ${endRange}`);
    }
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metrics Chart</CardTitle>
        <CardDescription>{timeRangeLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <BarChart accessibilityLayer data={timeSeries}>
            <XAxis
              dataKey="dayTime"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-metrics)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
