import { Suspense } from 'react';
import BarChartDemo from './components/BarChart/BarChartDemo';
import PieGraph from './components/PieGraph/PieGraph';
import GraphSkeleton from '@/src/app/components/GraphSkeleton/GraphSkeleton';

export default function MetricsDemo() {
  return (
    <>
      <h1 className="mb-10 text-2xl font-bold">Visualization Demo</h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <Suspense fallback={<GraphSkeleton />}>
            <BarChartDemo />
          </Suspense>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <Suspense fallback={<GraphSkeleton />}>
            <PieGraph />
          </Suspense>
        </div>
      </div>
    </>
  );
}
