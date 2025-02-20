import { AppSidebar } from '@/components/app-sidebar';
import { Spinner } from '@/components/spinner';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Suspense } from 'react';
import DashboardContent from '@/components/dashboard-content';
import { ErrorBoundary } from 'react-error-boundary';
import { Placeholder } from '@/components/placeholder';

const DashboardPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="font-semibold flex items-center gap-2 px-3">
            <SidebarTrigger />
            <p>Dashboard Content</p>
          </div>
        </header>

        <ErrorBoundary fallback={<Placeholder label="Something went wrong" />}>
          <Suspense
            fallback={
              <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DashboardContent />
          </Suspense>
        </ErrorBoundary>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardPage;
