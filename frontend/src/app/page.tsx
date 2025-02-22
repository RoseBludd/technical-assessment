import Dashboard from "@/src/components/dashboard/dashboard";
import { ThemeSwitcher } from "@/src/components/theme-switcher";
import { Suspense } from "react";
import DashboardLoader from "@/src/components/dashboard/dashboard-loader";

export default function DashboardPage() {
  return (
    <div className="mt-2 min-h-[80vh] rounded border">
      <header className="flex justify-between border-b px-8 py-4">
        <h3 className="text-2xl font-extrabold">Dashboard</h3>
        <ThemeSwitcher />
      </header>

      <main className="px-8 py-4">
        <Suspense fallback={<DashboardLoader />}>
          <Dashboard />
        </Suspense>
      </main>
    </div>
  );
}
