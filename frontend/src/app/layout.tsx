import type { Metadata } from 'next';
import './globals.css';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/src/app/components/ui/sidebar';
import DashBoardSideBar from '@/src/app/components/DashboardSideBar/DashboardSideBar';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Frontend assessment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <SidebarProvider>
          <DashBoardSideBar />
          <main className="w-full p-4 md:p-8" id="main">
            <SidebarTrigger className="mb-4" />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
