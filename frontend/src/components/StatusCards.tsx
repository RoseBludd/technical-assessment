"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatusUpdate } from "@/types";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { fetchStatus } from "@/actions/mock-data";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { SkeletonLoader } from "./SkeletonLoader";

export default function StatusCards({
  statusUpdates,
}: {
  statusUpdates: StatusUpdate[];
}) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
    initialData: statusUpdates,
    staleTime: 30000,
    refetchOnMount: false,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full h-full mx-auto">
      <CardHeader>
        <CardTitle className="text-md">Detailed Data</CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <>
            {!error ? (
              <div className="space-y-4">
                {data ? (
                  data.map((update) => (
                    <Alert
                      key={update.id}
                      variant={
                        update.status === "healthy" ? "default" : "destructive"
                      }
                    >
                      <AlertTitle className="flex items-center gap-2">
                        {getStatusIcon(update.status)}
                        {update.status.charAt(0).toUpperCase() +
                          update.status.slice(1)}
                      </AlertTitle>
                      <AlertDescription>
                        {update.message}
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Date(update.timestamp).toLocaleString()}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <p>No data available.</p>
                )}
              </div>
            ) : (
              <Button onClick={() => refetch()} className="mt-2">
                Retry
              </Button>
            )}
          </>
        ) : (
          <>
            <Skeleton className="h-[300px] w-full" />
          </>
        )}
      </CardContent>
    </Card>
  );
}
