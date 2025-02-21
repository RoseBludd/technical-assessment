import type { LucideIcon } from 'lucide-react';

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}

export interface SidebarNavItem extends NavItem {
  icon?: LucideIcon;
}
