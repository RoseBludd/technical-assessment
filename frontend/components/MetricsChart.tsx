'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesData } from '@/api/mock-data';

interface MetricsChartProps {
  data: TimeSeriesData[];
  className?: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ data, className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatValue = (value: number) => {
    return `${value.toLocaleString()}k`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card !p-3 !shadow-xl border-primary/20">
          <p className="text-sm font-medium text-muted-foreground">
            {new Date(label).toLocaleString()}
          </p>
          <p className="text-lg font-bold text-primary">
            {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`chart-container ${className}`}>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              Metrics Overview
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time performance metrics
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatValue(data[data.length - 1].value)}
            </div>
            <div className="text-sm text-muted-foreground">Current Value</div>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted))"
                vertical={false}
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatValue}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MetricsChart;
