import { LoadingBar } from '@/components/Loading';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LoadingBar />
      <nav className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
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

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 h-[500px] card animate-pulse">
              <div className="space-y-4 p-6">
                <div className="h-8 bg-muted rounded w-1/4"></div>
                <div className="h-[400px] bg-muted rounded"></div>
              </div>
            </div>

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
          </div>
        </div>
      </main>
    </div>
  );
}