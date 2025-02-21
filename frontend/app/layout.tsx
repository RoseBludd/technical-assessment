import AppSidebar from "@/components/app-sidebar/AppSidebar";
import ThemeProvider from "@/components/theme-provider/ThemeProvider";
import ThemeSwitcher from "@/components/theme-switcher/ThemeSwitcher";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const metadata = {
  title: "Frontend Specialist Assessment",
  description:
    "Create a modern, responsive dashboard using Next.js 14 that demonstrates your frontend expertise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex justify-between pr-10 md:pr-14 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                  </div>
                  <ThemeSwitcher />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
