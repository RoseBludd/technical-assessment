import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Developer Portal",
  description: "Task management and assessment platform for developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <body className="min-h-screen bg-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
