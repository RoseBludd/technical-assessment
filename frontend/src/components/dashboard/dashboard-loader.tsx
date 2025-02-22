import { Skeleton } from "@/src/components/ui/skeleton";

export default function DashboardLoader() {
  return (
    <div className="w-full flex gap-4 flex-col">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Skeleton className="flex h-[120px]" />
        <Skeleton className="flex h-[120px]" />
        <Skeleton className="flex h-[120px]" />
      </div>

      <Skeleton className="w-full h-[500px]" />
    </div>
  );
}
