'use client';

import { useState, useEffect } from 'react';
import { TimeRange, TimeSeriesData } from '@/app/api/metrics/route';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartArea } from '@/components/chart-area';

interface Props {
  units: TimeRange[];
}

const SkeletonChart = () => (
  <div className="flex flex-col space-y-3 h-[400px]">
    <Skeleton className="h-[300px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

const host = process.env.NEXT_PUBLIC_API_HOST;

const fetchMetrics = async (unit: string): Promise<TimeSeriesData[]> => {
  try {
    const res = await fetch(`${host}/api/metrics?metric=${unit}`);

    if (res) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const ChartAreaContainer = ({ units }: Props) => {
  const initialUnit = units.at(0);
  const [unit, setUnit] = useState(initialUnit);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data: TimeSeriesData[] = await fetchMetrics(unit);

        if (data) {
          setData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [unit]);

  return (
    <Card className="rounded-sm shadow-none dark:border-gray-600">
      <CardHeader className="relative">
        <CardTitle>Area Chart - Time Series</CardTitle>
        <CardDescription>Showing all data</CardDescription>
        <div className="absolute right-4 top-4">
          <Select
            defaultValue={initialUnit}
            onValueChange={(e: TimeRange) => setUnit(e)}
          >
            <SelectTrigger className="w-[180px] rounded-sm dark:border-gray-600">
              <SelectValue placeholder="Select an interval" />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              <SelectGroup>
                {units.map((item) => (
                  <SelectItem key={item} value={item}>
                    <span className="capitalize">{item}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <SkeletonChart /> : <ChartArea data={data} unit={unit} />}
      </CardContent>
    </Card>
  );
};
