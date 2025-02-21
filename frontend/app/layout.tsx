import { ThemeProvider } from "@/components/theme-provider/ThemeProvider";
import ThemeSwitcher from "@/components/theme-switcher/ThemeSwitcher";

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
            <main>
              <div>{children}</div>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
