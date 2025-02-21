import { Skeleton } from '@/components/ui/skeleton';

export function MetricsChartSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="mb-4 h-8 w-1/3" />
      <Skeleton className="h-[300px]" />
    </div>
  );
}

export function DataGridSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="mb-4 h-8 w-1/3" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    </div>
  );
}

export function StatusCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <Skeleton className="mb-2 h-6 w-1/2" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
