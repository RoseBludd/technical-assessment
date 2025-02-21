'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMetrics } from '@/api/mock-data';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function MetricsChart() {
    const [timeRange, setTimeRange] = useState<"hour" | "day" | "week">("day");

    const { data, error, isLoading } = useQuery({
        queryKey: ['metrics', timeRange],
        queryFn: ({ queryKey }) => fetchMetrics(queryKey[1] as "hour" | "day" | "week"),
    });

    if (isLoading) return <p>Loading metrics...</p>;
    if (error) return <p>Error loading data</p>;

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-bold">Metrics</h2>

            {/* Time Range Selector */}
            <div className="mb-4">
                <button className="p-2 mx-1 bg-blue-500 text-white rounded" onClick={() => setTimeRange("hour")}>
                    Hour
                </button>
                <button className="p-2 mx-1 bg-green-500 text-white rounded" onClick={() => setTimeRange("day")}>
                    Day
                </button>
                <button className="p-2 mx-1 bg-red-500 text-white rounded" onClick={() => setTimeRange("week")}>
                    Week
                </button>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
