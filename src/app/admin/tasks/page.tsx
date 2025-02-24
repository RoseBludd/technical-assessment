"use client";

import { useState, useEffect } from "react";
import {
  IconFilter,
  IconSearch,
  IconUserPlus,
  IconChevronLeft,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { Task } from "@/types/task";

interface Developer {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  position: string;
  lastActivity?: string;
}

export default function TaskPoolPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    complexity: "",
    category: "",
    status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, devsRes] = await Promise.all([
          fetch("/api/admin/tasks"),
          fetch("/api/admin/developers"),
        ]);

        if (!tasksRes.ok || !devsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const tasksData = await tasksRes.json();
        const devsData = await devsRes.json();

        const validStatuses = [
          "available",
          "assigned",
          "in_progress",
          "completed",
          "blocked",
        ] as const;

        setTasks(
          tasksData.map((task: any) => {
            const validStatus = validStatuses.includes(task.status)
              ? task.status
              : "available";
            return {
              ...task,
              status: validStatus,
              complexity: task.complexity || "medium",
              category: task.category || "NEW_FEATURE",
              requirements: task.requirements || [],
              acceptance_criteria: task.acceptance_criteria || [],
            } as Task;
          })
        );
        setDevelopers(devsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load task pool data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignTask = async (taskId: string, developerId: string) => {
    try {
      const response = await fetch("/api/admin/tasks/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          developerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign task");
      }

      // Refresh task list
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: "assigned" } : task
      );
      setTasks(updatedTasks);
      setShowAssignModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Error assigning task:", err);
      setError("Failed to assign task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDepartment =
      !filters.department || task.department === filters.department;
    const matchesComplexity =
      !filters.complexity || task.complexity === filters.complexity;
    const matchesCategory =
      !filters.category || task.category === filters.category;
    const matchesStatus = !filters.status || task.status === filters.status;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesComplexity &&
      matchesCategory &&
      matchesStatus
    );
  });

  const departments = Array.from(new Set(tasks.map((t) => t.department)));
  const categories = Array.from(new Set(tasks.map((t) => t.category)));
  const complexities = ["low", "medium", "high"];
  const statuses = [
    "available",
    "assigned",
    "in_progress",
    "completed",
    "blocked",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <IconChevronLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white">Task Pool</h1>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 bg-gray-800/30 p-4 rounded-xl">
        <div className="flex-1">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <button
          className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
          onClick={() => {
            setFilters({
              department: "",
              complexity: "",
              category: "",
              status: "",
            });
          }}
        >
          <IconX size={20} />
          Clear Filters
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={filters.department}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
          className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="" className="text-white bg-gray-800">
            All Departments
          </option>
          {departments.map((dept) => (
            <option key={dept} value={dept} className="text-white bg-gray-800">
              {dept}
            </option>
          ))}
        </select>

        <select
          value={filters.complexity}
          onChange={(e) =>
            setFilters({ ...filters, complexity: e.target.value })
          }
          className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="" className="text-white bg-gray-800">
            All Complexities
          </option>
          {complexities.map((complexity) => (
            <option
              key={complexity}
              value={complexity}
              className="text-white bg-gray-800"
            >
              {complexity}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="" className="text-white bg-gray-800">
            All Categories
          </option>
          {categories.map((category) => (
            <option
              key={category}
              value={category}
              className="text-white bg-gray-800"
            >
              {category.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="" className="text-white bg-gray-800">
            All Statuses
          </option>
          {statuses.map((status) => (
            <option
              key={status}
              value={status}
              className="text-white bg-gray-800"
            >
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {task.title}
                </h3>
                <span className="text-sm text-gray-400 mt-1">
                  {task.department}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium 
                  ${
                    task.complexity === "low"
                      ? "bg-green-900 text-green-200"
                      : task.complexity === "medium"
                      ? "bg-yellow-900 text-yellow-200"
                      : "bg-red-900 text-red-200"
                  }`}
                >
                  {task.complexity}
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium 
                  ${
                    task.status === "available"
                      ? "bg-green-900 text-green-200"
                      : task.status === "assigned"
                      ? "bg-blue-900 text-blue-200"
                      : task.status === "in_progress"
                      ? "bg-yellow-900 text-yellow-200"
                      : task.status === "completed"
                      ? "bg-purple-900 text-purple-200"
                      : "bg-red-900 text-red-200"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 mb-2">{task.description}</p>
                <div className="flex flex-wrap gap-2">
                  {task.requirements?.map((req, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700/30 rounded-full text-xs text-gray-300"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white ml-2">
                    {task.category.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Compensation:</span>
                  <span className="text-white ml-2">${task.compensation}</span>
                </div>
                {task.estimatedTime && (
                  <div className="col-span-2">
                    <span className="text-gray-400">Estimated Time:</span>
                    <span className="text-white ml-2">
                      {task.estimatedTime}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedTask(task);
                  setShowAssignModal(true);
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                disabled={task.status !== "available"}
              >
                <IconUserPlus className="h-5 w-5" />
                {task.status === "available"
                  ? "Assign Developer"
                  : "Already Assigned"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Assign Developer to Task
            </h2>
            <p className="text-gray-400 mb-4">{selectedTask.title}</p>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {developers.map((dev) => (
                <button
                  key={dev.id}
                  onClick={() => handleAssignTask(selectedTask.id, dev.id)}
                  className="w-full p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-left transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{dev.name}</p>
                      <p className="text-gray-400 text-sm">{dev.position}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        dev.status === "active"
                          ? "bg-green-900/50 text-green-300 border border-green-500/20"
                          : "bg-gray-900/50 text-gray-300 border border-gray-500/20"
                      }`}
                    >
                      {dev.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedTask(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
