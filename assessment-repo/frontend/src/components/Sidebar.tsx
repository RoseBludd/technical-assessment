'use client';

import { useState } from 'react';
import Link from 'next/link';
import SidebarNav from '@/components/SidebarNav';
import { dashboardConfig } from '@/config/dashboard';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Icons from '@/components/ui/icons';

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-background md:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">Metrics Data</span>
          </Link>
        </div>
        <SidebarNav items={dashboardConfig.sidebarNav} />
      </aside>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent position="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold">Metrics Data</span>
            </Link>
          </div>
          <SidebarNav items={dashboardConfig.sidebarNav} />
        </SheetContent>
      </Sheet>
    </>
  );
}
