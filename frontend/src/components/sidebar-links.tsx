'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, routes } from '@/lib/utils';
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export const SidebarLinks = () => {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  return (
    <SidebarMenu>
      {routes.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link
              href={item.url}
              onClick={() => setOpenMobile(false)}
              className={cn({ 'font-bold': pathname === item.url })}
            >
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
