'use client';

import MetricsDashboard from "../components/MetricsDashboard";
import { useTheme } from "../providers/ThemeContext";

export default function DashboardPage() {
  const { theme } = useTheme();
  return (
    <main className={`min-h-screen bg-background ${theme === 'dark' ? 'bg-secondary' : 'bg-background'}`}>
      <MetricsDashboard />
    </main>
  );
}