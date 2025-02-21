'use client';

import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TimeSeriesData, TimeRange } from '@/types/metrics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MetricsChartProps {
  data: TimeSeriesData[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isRefetching?: boolean;
}

const MetricsChart = ({
  data,
  timeRange,
  onTimeRangeChange,
  isRefetching = false,
}: MetricsChartProps) => {
  const calculateTrend = () => {
    if (data.length < 2) return 0;
    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    return ((latest - previous) / previous) * 100;
  };

  const trend = calculateTrend();
  const trendIsUp = trend >= 0;

  const chartConfig = {
    value: {
      label: 'Metrics Value',
      color: trendIsUp ? 'rgb(34 197 94)' : 'rgb(239 68 68)', // green-500 : red-500
    },
  } satisfies ChartConfig;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    switch (timeRange) {
      case 'hour':
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'day':
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'week':
        return date.toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
        });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          Metrics Overview
          {isRefetching && (
            <span className="ml-2 text-sm text-muted-foreground">
              Updating...
            </span>
          )}
        </CardTitle>
        <Select
          defaultValue={timeRange}
          onValueChange={(value: TimeRange) => onTimeRangeChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">Last Hour</SelectItem>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 12,
                left: 12,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatDate}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
                label={{
                  value: 'Value',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 0,
                  style: { textAnchor: 'middle' },
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                type="monotone"
                dataKey="value"
                fill="var(--color-value)"
                fillOpacity={0.2}
                stroke="var(--color-value)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <span className={trendIsUp ? 'text-green-500' : 'text-red-500'}>
                {trendIsUp ? 'Trending up' : 'Trending down'} by{' '}
                {Math.abs(trend).toFixed(1)}%
              </span>
              {trendIsUp ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Last {data.length} data points
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MetricsChart;
