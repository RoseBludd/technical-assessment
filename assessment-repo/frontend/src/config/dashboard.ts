import type { DashboardConfig } from '@/types/dashboard';
import { LayoutDashboard, Settings, FileText } from 'lucide-react';

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
  ],
};
