import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-[200px]" />
        </CardTitle>
        <Skeleton className="h-4 w-[300px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}
