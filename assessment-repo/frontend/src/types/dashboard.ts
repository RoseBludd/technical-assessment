import type { NavItem } from './nav';

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}

export interface SidebarNavItem extends NavItem {
  icon?: string;
}
