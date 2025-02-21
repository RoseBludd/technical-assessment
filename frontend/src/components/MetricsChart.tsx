"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMetrics } from "@/actions/mock-data";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import LineGraph from "./LineGraph";
import { TimeRange, TimeSeries } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function MetricsChart({
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

  const getChartTitle = () => {
    switch (timeRange) {
      case "hour":
        return "Hourly Trend";
      case "day":
        return "Daily Trend";
      case "week":
        return "Weekly Trend";
      default:
        return "Value Over Time";
    }
  };

  return (
    <div>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-md">{getChartTitle()}</CardTitle>

            <div className="flex space-x-2">
              {data && (
                <>
                  <Button
                    size={"sm"}
                    onClick={() => handleTimeRangeChange("hour")}
                    variant={timeRange === "hour" ? "default" : "outline"}
                  >
                    Hour
                  </Button>
                  <Button
                    size={"sm"}
                    onClick={() => handleTimeRangeChange("day")}
                    variant={timeRange === "day" ? "default" : "outline"}
                  >
                    Day
                  </Button>
                  <Button
                    size={"sm"}
                    onClick={() => handleTimeRangeChange("week")}
                    variant={timeRange === "week" ? "default" : "outline"}
                  >
                    Week
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!isLoading ? (
            <>
              {!error ? (
                <>
                  {data ? (
                    <LineGraph chartData={data} timeRange={timeRange} />
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
    </div>
  );
}
