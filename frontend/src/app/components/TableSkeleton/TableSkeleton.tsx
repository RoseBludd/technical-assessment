import { Skeleton } from '../ui/skeleton';

const TableSkeleton = () => (
  <div
    className="mx-auto w-full rounded-md border p-4"
    data-testid="table-skeleton"
  >
    <div className="grid grid-cols-8 gap-6">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="col-span-2 h-4 rounded bg-gray-200" />
      ))}
    </div>
    {Array.from({ length: 4 }, (_, index) => (
      <Skeleton key={index} className="h-4 rounded bg-gray-200" />
    ))}
  </div>
);

export default TableSkeleton;
