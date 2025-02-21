"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface CustomLineChartProps<T> {
  chartConfig: ChartConfig;
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
}
export default function CustomLineChart<T>({
  chartConfig,
  data,
  xKey,
  yKey,
}: CustomLineChartProps<T>) {
  return (
    <ChartContainer config={chartConfig} className="w-auto h-auto">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey as string}
          tickLine={false}
          axisLine={false}
          tickMargin={5}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey={yKey as string}
          type="natural"
          stroke="var(--color-value)"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
