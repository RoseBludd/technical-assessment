"use client";

import AdminNavigation from "../components/AdminNavigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card backdrop-blur-sm bg-gray-900/50">{children}</div>
      </div>
    </div>
  );
}
