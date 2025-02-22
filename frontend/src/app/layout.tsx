import "./globals.css";
import { ThemeProvider } from "@/src/components/theme-provider";

export default function DashboardLayout({
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
            <div className="container mx-auto">{children}</div>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
