'use client';

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Loading from '@/components/ui/loading';
import { useMetrics } from '@/hooks/use-metrics';
import MetricsChart from '@/components/MetricsChart';
import DataGrid from '@/components/DataGrid';
import StatusCards from '@/components/StatusCards';
import { StatusCardsSkeleton } from '@/components/LoadingSkeletons';
import { MetricsChartSkeleton } from '@/components/LoadingSkeletons';
import { DataGridSkeleton } from '@/components/LoadingSkeletons';

function DashboardContent() {
  const { metrics, status, isLoading, error } = useMetrics();

  if (error) {
    throw error;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatusCardsSkeleton />
        <div className="grid gap-6 md:grid-cols-2">
          <MetricsChartSkeleton />
          <DataGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid-cols grid gap-6">
        <StatusCards data={status} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <MetricsChart data={metrics} />
        <DataGrid data={status} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
}
