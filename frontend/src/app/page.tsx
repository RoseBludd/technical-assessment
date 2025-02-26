import { Suspense } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartRadialContainer } from '@/components/chart-radial-container';
import Status from '@/components/status';
import { ChartAreaContainer } from '@/components/chart-area-container';

export type Units = 'week' | 'day' | 'hour';

const units: Units[] = ['week', 'day', 'hour'];

const getUnitValue = (unit: Units) => {
  switch (unit) {
    case 'hour':
      return 200;
    case 'day':
      return 24;
    case 'week':
      return 7;
  }
};

const SkeletonLoader = () => (
  <>
    {[...Array(units.length)].map((_, i) => (
      <div
        className="col-span-3 lg:col-span-1"
        key={`key-unit-${units[i]}`}
        {...(i === 0 ? { 'data-testid': 'skeleton' } : {})}
      >
        <div className="flex items-center space-x-4 h-[84px] w-full">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    ))}
  </>
);

export default function Home() {
  return (
    <div className="container p-4">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight mb-4 first:mt-0">
        Dashboard
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <Suspense fallback={<SkeletonLoader />}>
          <Status />
        </Suspense>
        <div className="col-span-3">
          <ChartAreaContainer units={units} />
        </div>
        {units.map((interval) => {
          const value = getUnitValue(interval);
          return (
            <div
              className="col-span-3 lg:col-span-1"
              key={`interval-${interval}`}
            >
              <Card className="rounded-sm shadow-none dark:border-gray-600">
                <CardHeader className="pb-0">
                  <CardTitle>Time range</CardTitle>
                  <CardDescription className="capitalize">
                    {interval}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartRadialContainer value={value} range={interval} />
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
