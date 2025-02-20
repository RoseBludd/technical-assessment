"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { TimeSeriesData } from "../../api/mock-data";

interface MetricsChartProps {
  data: TimeSeriesData[];
}

export default function MetricsChart({ data }: MetricsChartProps) {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedTime: new Date(item.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-300">{label}</p>
          <p className="text-indigo-400 font-semibold">
            Value: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="formattedTime"
            stroke="#6b7280"
            tick={{ fill: '#9ca3af' }}
            tickLine={{ stroke: '#6b7280' }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#9ca3af' }}
            tickLine={{ stroke: '#6b7280' }}
          />
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#374151"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#colorValue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}