"use client";

import { fetchMetrics, TimeSeriesData } from "@/api/mock-data";
import PageTemplate from "@/components/templates/PageTemplate";
import MetricsTable from "./components/MetricsTable";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms";
import { IOption, SelectField } from "@/components/molecules";

export type ITimeRange = "hour" | "day" | "week";

const timeRangeOptions: IOption[] = [
  {
    label: "Day",
    value: "day",
  },
  {
    label: "Hour",
    value: "hour",
  },
  {
    label: "Week",
    value: "week",
  },
];

const Metrics = () => {
  const [timeRange, setTimeRange] = useState<ITimeRange>("day");
  const [metricsData, setMetricsData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchMetrics(timeRange);
        setMetricsData(response);
      } catch (err) {
        setError(
          "There was a problem getting metrics data. Please try again later"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const handleResetFilters = () => {
    setTimeRange("day");
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as ITimeRange);
  };

  return (
    <PageTemplate title="Metrics">
      <div className="space-y-6 mb-6">
        <SelectField
          options={timeRangeOptions}
          placeholder="Select Time Range"
          value={timeRange}
          onValueChange={handleTimeRangeChange}
        />
        <div className="text-right">
          <Button onClick={handleResetFilters}>Reset Filters</Button>
        </div>
      </div>
      <MetricsTable metricsData={metricsData} error={error} loading={loading} />
    </PageTemplate>
  );
};

export default Metrics;
