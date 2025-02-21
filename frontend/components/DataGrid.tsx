'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMetrics } from '@/api/mock-data';
import { useState } from 'react';


export default function DataGrid() {
    const [timeRange, setTimeRange] = useState<"hour" | "day" | "week">("day");

    const { data, isLoading, error } = useQuery({
        queryKey: ['grid-data', timeRange],
        queryFn: ({ queryKey }) => fetchMetrics(queryKey[1] as "hour" | "day" | "week")
    })

    if (isLoading) return <p>Loading data...</p>
    if (error) return <p>Error loading data</p>

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-bold">Historical Data</h2>

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

            {/* Table */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="p-2">Timestamp</th>
                        <th className="p-2">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.timestamp} className="border-b">
                            <td className="p-2">{item.timestamp}</td>
                            <td className="p-2">{item.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
