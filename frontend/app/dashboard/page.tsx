'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Loading from '@/components/Loading';
import ErrorFallback from '@/components/ErrorFallback';
import StatusCards from '@/components/StatusCards';
import DataGrid from '@/components/DataGrid';
import MetricsChart from '@/components/MetricsChart';

export default function Dashboard() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<Loading />}>
                    <StatusCards />
                </Suspense>
                <Suspense fallback={<Loading />}>
                    <MetricsChart />
                </Suspense>
                <Suspense fallback={<Loading />}>
                    <DataGrid />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}
