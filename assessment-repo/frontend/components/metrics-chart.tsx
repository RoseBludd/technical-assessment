"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface MetricsChartProps {
  label: string
  data: { timestamp: string; value: number }[]
}

const MetricsChart: React.FC<MetricsChartProps> = ({ label, data }) => {
  return (
    <div className="w-full space-y-4">
      {/* Chart Header */}
      <h2 className="text-xl font-semibold text-center">{label} Metrics</h2>

      {/* Chart Container */}
      <div className="w-full h-[400px] " >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            {/* X-Axis */}
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp)
                return date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
              className="text-sm"
            />

            {/* Y-Axis */}
            <YAxis className="text-sm" />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--secondary))",
                border: "1px solid rgb(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelFormatter={(timestamp) => {
                const date = new Date(timestamp)
                return date.toLocaleString()
              }}
            />

            {/* Data Line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="rgb(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MetricsChart