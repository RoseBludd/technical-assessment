import { Suspense } from 'react';
import Loading from '@/components/Loading';
import MetricsChart from '@/components/MetricsChart';
import DataGrid from '@/components/DataGrid';
import StatusCards from '@/components/StatusCards';
import ThemeToggle from '@/components/ThemeToggle';
import DashboardFooter from '@/components/DashboardFooter';
import { fetchMetrics, fetchStatus } from '@/api/mock-data';

export const revalidate = 60; // Revalidate every minute

export default async function Dashboard() {
  const [metricsData, statusData] = await Promise.all([
    fetchMetrics(),
    fetchStatus(),
  ]).catch((error) => {
    console.error('Failed to fetch dashboard data:', error);
    throw new Error('Failed to load dashboard data');
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold gradient-text">
                Metrics Dashboard
              </h1>
              <div className="hidden sm:block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Live
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          <Suspense
            fallback={
              <div className="metrics-grid">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="card animate-pulse h-32 flex items-center justify-center"
                  >
                    <div className="space-y-3 w-full px-6">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-8 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <StatusCards data={statusData} />
          </Suspense>

          <div className="grid gap-8 lg:grid-cols-5">
            <Suspense
              fallback={
                <div className="lg:col-span-3 h-[500px] card animate-pulse">
                  <div className="space-y-4 p-6">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="h-[400px] bg-muted rounded-lg"></div>
                  </div>
                </div>
              }
            >
              <MetricsChart data={metricsData} className="lg:col-span-3" />
            </Suspense>

            <Suspense
              fallback={
                <div className="lg:col-span-2 h-[500px] card animate-pulse">
                  <div className="space-y-4 p-6">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="space-y-2">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <DataGrid data={metricsData} className="lg:col-span-2" />
            </Suspense>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
