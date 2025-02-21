"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataPoint {
  timestamp: string;
  value: number;
}

interface LineGraphProps {
  chartData: ChartDataPoint[];
  timeRange: "hour" | "day" | "week";
}

export default function LineGraph({ chartData, timeRange }: LineGraphProps) {
  const formatXAxis = (tickItem: string) => {
    const date = parseISO(tickItem);
    switch (timeRange) {
      case "hour":
        return format(date, "HH:mm");
      case "day":
        return format(date, "HH:00");
      case "week":
        return format(date, "EEE");
      default:
        return format(date, "HH:mm");
    }
  };

  return (
    <ChartContainer
      config={{
        value: {
          label: "Value",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="w-full"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatXAxis}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis stroke="hsl(var(--muted-foreground))" width={20} />
        {/* <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload as ChartDataPoint;
              return (
                <ChartTooltipContent labelKey="timestamp" nameKey="value" />
              );
            }
            return null;
          }}
        /> */}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
