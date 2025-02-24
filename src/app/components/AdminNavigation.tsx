"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconUsers, IconClipboardList } from "@tabler/icons-react";

export default function AdminNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") return true;
    if (path !== "/admin" && pathname.startsWith(path)) return true;
    return false;
  };

  const links = [
    { href: "/admin", label: "Dashboard", icon: IconHome },
    { href: "/admin/applicants", label: "Applicants", icon: IconUsers },
    {
      href: "/admin/test-results",
      label: "Test Results",
      icon: IconClipboardList,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/70 border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link
              href="/admin"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-400 hover:from-indigo-300 hover:to-indigo-500 transition-all"
            >
              RestoreMasters
            </Link>
            <div className="hidden md:flex items-center gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10 border border-indigo-500/30"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" strokeWidth={1.5} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
