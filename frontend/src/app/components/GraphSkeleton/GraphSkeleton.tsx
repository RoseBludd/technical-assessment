import { Skeleton } from '../ui/skeleton';

const GraphSkeleton = () => (
  <div
    className="mx-auto flex w-full flex-col gap-6 rounded-md border p-4"
    data-testid="graph-skeleton"
  >
    <Skeleton className="h-10 rounded bg-gray-200" />
    <Skeleton className="h-10 rounded bg-gray-200" />
    <Skeleton className="h-10 rounded bg-gray-200" />
  </div>
);

export default GraphSkeleton;
