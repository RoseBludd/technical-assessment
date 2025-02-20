"use client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-white font-semibold">RestoreMasters</div>
            <div className="text-white font-semibold">Admin Dashboard</div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
