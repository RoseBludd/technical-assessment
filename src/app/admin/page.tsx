"use client";

import { useEffect, useState } from "react";
import {
  IconUsers,
  IconClipboardList,
  IconHourglassHigh,
  IconCheckbox,
  IconChartBar,
  IconClock,
  IconBuildingFactory2,
  IconActivity,
} from "@tabler/icons-react";
import Link from "next/link";

interface DashboardStats {
  totalTasks: number;
  activeDevelopers: number;
  pendingAssignments: number;
  completedTasks: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface PerformanceMetrics {
  avgCompletionTime: string;
  successRate: number;
  taskAcceptanceRate: number;
}

interface DepartmentStats {
  name: string;
  activeTasks: number;
  completionRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    activeDevelopers: 0,
    pendingAssignments: 0,
    completedTasks: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "assignment",
      description: "New task assigned to John Doe",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "submission",
      description: "Task submission from Jane Smith",
      timestamp: "3 hours ago",
    },
    {
      id: "3",
      type: "application",
      description: "New developer application received",
      timestamp: "5 hours ago",
    },
  ]);

  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>({
      avgCompletionTime: "2.5 days",
      successRate: 85,
      taskAcceptanceRate: 92,
    });

  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([
    {
      name: "customer_updates",
      activeTasks: 10,
      completionRate: 70,
    },
    {
      name: "estimating",
      activeTasks: 8,
      completionRate: 85,
    },
    {
      name: "file_review",
      activeTasks: 12,
      completionRate: 75,
    },
    {
      name: "storm_opportunity",
      activeTasks: 7,
      completionRate: 60,
    },
    {
      name: "production",
      activeTasks: 6,
      completionRate: 80,
    },
    {
      name: "sales",
      activeTasks: 9,
      completionRate: 65,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setError("Failed to fetch dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4 text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-400">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-400">Welcome to the Admin Dashboard</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-300 text-sm">Active Developers</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {stats.activeDevelopers}
              </h3>
            </div>
            <div className="bg-indigo-500/20 p-3 rounded-lg">
              <IconUsers className="h-6 w-6 text-indigo-300" />
            </div>
          </div>
        </div>

        <Link href="/admin/tasks" className="block">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-500/20 hover:bg-blue-800/40 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Tasks</p>
                <h3 className="text-3xl font-bold text-white mt-1">
                  {stats.totalTasks}
                </h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <IconClipboardList className="h-6 w-6 text-blue-300" />
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-xl p-6 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-300 text-sm">Pending Assignments</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {stats.pendingAssignments}
              </h3>
            </div>
            <div className="bg-amber-500/20 p-3 rounded-lg">
              <IconHourglassHigh className="h-6 w-6 text-amber-300" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm">Completed Tasks</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {stats.completedTasks}
              </h3>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <IconCheckbox className="h-6 w-6 text-emerald-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <IconActivity className="h-5 w-5 text-blue-400 mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
              >
                <div>
                  <p className="text-gray-200">{activity.description}</p>
                  <p className="text-sm text-gray-400">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <IconChartBar className="h-5 w-5 text-green-400 mr-2" />
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div>
                <p className="text-gray-400">Average Completion Time</p>
                <p className="text-xl text-white">
                  {performanceMetrics.avgCompletionTime}
                </p>
              </div>
              <IconClock className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div>
                <p className="text-gray-400">Success Rate</p>
                <p className="text-xl text-white">
                  {performanceMetrics.successRate}%
                </p>
              </div>
              <IconCheckbox className="h-6 w-6 text-green-400" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div>
                <p className="text-gray-400">Task Acceptance Rate</p>
                <p className="text-xl text-white">
                  {performanceMetrics.taskAcceptanceRate}%
                </p>
              </div>
              <IconClipboardList className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <IconBuildingFactory2 className="h-5 w-5 text-purple-400 mr-2" />
            Department Overview
          </h2>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="p-4 bg-gray-700/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white">
                    {dept.name.replace(/_/g, " ").toUpperCase()}
                  </h3>
                  <span className="text-gray-400">
                    {dept.activeTasks} active tasks
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${dept.completionRate}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {dept.completionRate}% completion rate
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links & System Status */}
        <div className="space-y-6">
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/admin/applicants"
                className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <IconUsers className="h-5 w-5 text-indigo-400 mr-3" />
                <span className="text-gray-200">Manage Applicants</span>
              </Link>
              <Link
                href="/admin/test-results"
                className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <IconClipboardList className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-200">View Test Results</span>
              </Link>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Database Connection</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">API Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
