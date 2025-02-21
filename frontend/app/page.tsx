import "@/styles/global.css";
import { Suspense } from "react";
import Loading from "./loading";
import MetricsDataOne from "@/components/metrics-data-one/MetricsDataOne";
import DashboardItem from "@/components/dashboard-item/DashboardItem";
import MetricsDataTwo from "@/components/metrics-data-two/MetricsDataTwo";
import MetricsDataThree from "@/components/metrics-data-three/MetricsDataThree";
import DataGrid from "@/components/data-grid/DataGrid";

export default function Dashboard() {
  return (
    <>
      <Suspense fallback={<Loading className="h-12 w-12" />}>
        <h2 className="p-5 my-5 border  bg-gray-100 text-gray-700 dark:bg-muted/40 dark:text-gray-300 font-bold text-xl">
          Metrics Visualization
        </h2>
        <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardItem title="Line Chart">
            <Suspense fallback={<Loading />}>
              <MetricsDataOne />
            </Suspense>
          </DashboardItem>
          <DashboardItem title="Bar Chart">
            <Suspense fallback={<Loading />}>
              <MetricsDataTwo />
            </Suspense>
          </DashboardItem>
          <DashboardItem title="Area Chart">
            <Suspense fallback={<Loading />}>
              <MetricsDataThree />
            </Suspense>
          </DashboardItem>
        </div>
        <div className="min-h-[100vh] flex-1 md:min-h-min mb-24">
          <h2 className="p-5 my-5 border  bg-gray-100 text-gray-700 dark:bg-muted/40 dark:text-gray-300 font-bold text-xl">
            System logs
          </h2>
          <Suspense fallback={<Loading />}>
            <DataGrid />
          </Suspense>
        </div>
      </Suspense>
    </>
  );
}
