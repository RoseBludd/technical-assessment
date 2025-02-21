import { Suspense } from "react";
import MetricsChart from "@/components/MetricsChart";
import DataGrid from "@/components/DataGrid";
import StatusCards from "@/components/StatusCards";
import { fetchMetrics, fetchStatus } from "@/actions/mock-data";
import { ErrorBoundary } from "react-error-boundary";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { TableSkeleton } from "@/components/TableSkeleton";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const metricsData = await fetchMetrics("day");
  const statusUpdates = (await fetchStatus()) ?? [];

  return (
    <div className="dashboard-layout">
      <Suspense fallback={<div>Loading...</div>}>
        {/* Implement your dashboard here */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 md:row-start-1">
            <ErrorBoundary
              fallback={
                <div>
                  Error loading metrics overview. Please try again later.
                </div>
              }
            >
              <Suspense fallback={<SkeletonLoader />}>
                <MetricsChart metricsData={metricsData} />
              </Suspense>
            </ErrorBoundary>
          </div>
          <div className="md:row-start-1">
            <ErrorBoundary
              fallback={
                <div>
                  Error loading detailed metrics. Please try again later.
                </div>
              }
            >
              <Suspense fallback={<SkeletonLoader />}>
                <StatusCards statusUpdates={statusUpdates} />
              </Suspense>
            </ErrorBoundary>
          </div>
          <div className="md:row-start-2 md:col-span-3">
            <ErrorBoundary
              fallback={
                <div>Error loading system status. Please try again later.</div>
              }
            >
              <Suspense fallback={<TableSkeleton />}>
                <DataGrid metricsData={metricsData} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
