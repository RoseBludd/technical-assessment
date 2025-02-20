import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "../components/generics/Loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Donaire's Metrics Dashboard",
  description: "Metrics Dashboard for Donaire's Metrics Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <Suspense fallback={<Loading />}>
        <body className="min-h-screen bg-gray-900">{children}</body>
      </Suspense>
    </html>
  );
}
