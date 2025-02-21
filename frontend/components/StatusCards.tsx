'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStatus } from '@/api/mock-data';

export default function StatusCards() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['status'],
        queryFn: fetchStatus,
    });

    if (isLoading) return <p>Loading status...</p>;
    if (error) return <p>Error loading status</p>;

    return (
        <div className="grid grid-cols-3 gap-4">
            {data.map((item) => (
                <div
                    key={item.id}
                    className={`p-4 rounded-lg shadow ${item.status === 'healthy'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : item.status === 'warning'
                            ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                            : 'bg-red-100 border-red-500 text-red-700'
                        }`}
                >
                    <h3 className="font-bold text-lg capitalize">{item.status}</h3>
                    <p className="text-sm">{item.message}</p>
                    <p className="text-xs text-gray-500">
                        Updated: {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                </div>
            ))}
        </div>
    );
}
