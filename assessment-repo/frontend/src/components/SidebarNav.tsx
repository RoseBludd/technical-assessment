import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { SidebarNavItem } from '@/types/dashboard';
import { LayoutDashboard as LayoutDashboardIcon } from 'lucide-react';

interface SidebarNavProps {
  items: SidebarNavItem[];
}

function SidebarNav({ items }: SidebarNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          item.href && (
            <Link key={index} href={item.disabled ? '/' : item.href}>
              <span
                className={cn(
                  'group flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  path === item.href ? 'bg-accent' : 'transparent',
                  item.disabled && 'cursor-not-allowed opacity-80'
                )}
              >
                {Icon && <Icon />}
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}

export default SidebarNav;
