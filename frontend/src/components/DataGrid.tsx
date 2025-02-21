"use client";

import { TimeRange, TimeSeries } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DataTable } from "./DataTable";
import { columns } from "./Columns";
import { TableSkeleton } from "./TableSkeleton";
import { useCallback, useState } from "react";
import { fetchMetrics } from "@/actions/mock-data";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

export default function DataGrid({
  metricsData,
}: {
  metricsData: TimeSeries[];
}) {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["metrics", timeRange],
    queryFn: async ({ queryKey: [_, timeRange] }) => {
      return fetchMetrics(timeRange as TimeRange);
    },
    initialData: metricsData,
    refetchOnMount: false,
    staleTime: 60000,
  });

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(() => range);
    refetch();
  }, []);

  return (
    <div>
      {data ? (
        <Card className="w-full">
          <CardHeader className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-md">Metrics Table</CardTitle>
            <Select
              value={timeRange}
              onValueChange={(val) => handleTimeRangeChange(val as TimeRange)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Hour</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {!isLoading ? (
              <>
                {!error ? (
                  <>
                    {data ? (
                      <DataTable columns={columns} data={data} />
                    ) : (
                      <p>No data available.</p>
                    )}
                  </>
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
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
}
