"use client";

import { useState, useEffect } from "react";
import {
  IconFilter,
  IconSearch,
  IconUserPlus,
  IconChevronLeft,
  IconX,
  IconPlus,
  IconCheck,
  IconEdit,
} from "@tabler/icons-react";
import Link from "next/link";
import { Task, TaskStatus, TaskPriority, TaskCategory, TaskComplexity } from "@/types/task";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";

interface Developer {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  position: string;
  lastActivity?: string;
}

interface Department {
  name: string;
  display_name: string;
}

export default function TaskPoolPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "date" | "department">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState({
    department: "",
    complexity: "",
    category: "",
    status: "",
    priority: "",
  });
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, devsRes, deptsRes] = await Promise.all([
        fetch("/api/admin/tasks"),
        fetch("/api/admin/developers"),
        fetch("/api/admin/departments"),
      ]);

      if (!tasksRes.ok || !devsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const tasksData = await tasksRes.json();
      const devsData = await devsRes.json();
      
      let departmentsData: Department[] = [];
      if (deptsRes.ok) {
        departmentsData = await deptsRes.json();
        setDepartmentsList(departmentsData);
      }

      const validStatuses = [
        "available",
        "assigned",
        "in_progress",
        "completed",
        "blocked",
      ] as const;

      const validCategories = [
        "NEW_FEATURE",
        "BUG_FIX",
        "INTEGRATION",
        "AUTOMATION",
        "OPTIMIZATION"
      ] as const;

      const mappedTasks = Array.isArray(tasksData) ? tasksData.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        department: task.department,
        compensation: task.compensation,
        status: (validStatuses.includes(task.status) ? task.status : "available") as TaskStatus,
        priority: (task.priority || "medium") as TaskPriority,
        category: (validCategories.includes(task.category) ? task.category : "NEW_FEATURE") as TaskCategory,
        complexity: (task.complexity || "medium") as TaskComplexity,
        estimated_time: task.estimated_time || 0,
        requirements: task.requirements || [],
        acceptance_criteria: task.acceptance_criteria || [],
        updatedAt: task.updated_at || task.updatedAt || new Date().toISOString(),
        start_date: task.start_date || new Date().toISOString(),
        due_date: task.due_date || new Date().toISOString(),
      })) satisfies Task[] : [] as Task[];
      
      setTasks(mappedTasks);
      setDevelopers(devsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load task pool data");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    // Show success notification
    setSuccessMessage("Task created successfully!");
    setShowSuccessNotification(true);
    
    // Close create modal
    setShowCreateModal(false);
    
    // Refresh data
    fetchData();
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

  const handleTaskUpdated = () => {
    // Show success notification
    setSuccessMessage("Task updated successfully!");
    setShowSuccessNotification(true);
    
    // Close edit modal
    setShowEditModal(false);
    setSelectedTask(null);
    
    // Refresh data
    fetchData();
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

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
        task.id === taskId ? { ...task, status: "assigned" as TaskStatus } : task
      );
      setTasks(updatedTasks);
      setShowAssignModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Error assigning task:", err);
      setError("Failed to assign task");
    }
  };

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
        return sortOrder === "asc" ? -diff : diff;
      } else if (sortBy === "date") {
        const aDate = a.updatedAt ? new Date(a.updatedAt) : new Date();
        const bDate = b.updatedAt ? new Date(b.updatedAt) : new Date();
        const diff = bDate.getTime() - aDate.getTime();
        return sortOrder === "asc" ? -diff : diff;
      } else {
        // department
        const diff = a.department.localeCompare(b.department);
        return sortOrder === "asc" ? diff : -diff;
      }
    });
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
    const matchesPriority =
      !filters.priority || task.priority === filters.priority;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesComplexity &&
      matchesCategory &&
      matchesStatus &&
      matchesPriority
    );
  });

  const sortedAndFilteredTasks = sortTasks(filteredTasks);

  const departments = Array.from(new Set(tasks.map((t) => t.department)));
  const categories = ["NEW_FEATURE", "BUG_FIX", "INTEGRATION", "AUTOMATION", "OPTIMIZATION"];
  const complexities = ["low", "medium", "high"];
  const priorities = ["low", "medium", "high", "urgent"];
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
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin"
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <IconChevronLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </Link>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <IconPlus className="h-5 w-5" />
          Create Task
        </button>
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
              priority: "",
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
          {departmentsList.map((dept) => (
            <option key={dept.name} value={dept.name} className="text-white bg-gray-800">
              {dept.display_name}
            </option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
          className="bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="" className="text-white bg-gray-800">
            All Priorities
          </option>
          {priorities.map((priority) => (
            <option
              key={priority}
              value={priority}
              className="text-white bg-gray-800"
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
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
              {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
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
              {category.replace(/_/g, " ")}
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
              {status.replace(/_/g, " ").charAt(0).toUpperCase() + status.replace(/_/g, " ").slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-xl">
        <span className="text-gray-400">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "priority" | "date" | "department")}
          className="bg-gray-700/50 border border-gray-600 rounded-lg text-white px-3 py-1 focus:outline-none focus:border-indigo-500"
        >
          <option value="date">Date</option>
          <option value="priority">Priority</option>
          <option value="department">Department</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-6">
        {sortedAndFilteredTasks.map((task) => (
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
                    task.priority === "urgent"
                      ? "bg-red-900/70 text-red-200 border border-red-500/30"
                      : task.priority === "high"
                      ? "bg-orange-900/70 text-orange-200 border border-orange-500/30"
                      : task.priority === "medium"
                      ? "bg-yellow-900/70 text-yellow-200 border border-yellow-500/30"
                      : "bg-green-900/70 text-green-200 border border-green-500/30"
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium 
                  ${
                    task.status === "available"
                      ? "bg-green-900/70 text-green-200 border border-green-500/30"
                      : task.status === "assigned"
                      ? "bg-blue-900/70 text-blue-200 border border-blue-500/30"
                      : task.status === "in_progress"
                      ? "bg-yellow-900/70 text-yellow-200 border border-yellow-500/30"
                      : task.status === "completed"
                      ? "bg-purple-900/70 text-purple-200 border border-purple-500/30"
                      : "bg-red-900/70 text-red-200 border border-red-500/30"
                  }`}
                >
                  {task.status.replace("_", " ").toUpperCase()}
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
                    {task.category?.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Compensation:</span>
                  <span className="text-white ml-2">${task.compensation}</span>
                </div>
                {task.estimated_time && (
                  <div className="col-span-2">
                    <span className="text-gray-400">Estimated Time:</span>
                    <span className="text-white ml-2">
                      {task.estimated_time} hours
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowEditModal(true);
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <IconEdit className="h-5 w-5" />
                  Edit Task
                </button>
                
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowAssignModal(true);
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  disabled={task.status !== "available"}
                >
                  <IconUserPlus className="h-5 w-5" />
                  {task.status === "available"
                    ? "Assign Developer"
                    : "Already Assigned"}
                </button>
              </div>
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

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {/* Edit Task Modal */}
      {showEditModal && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed bottom-4 right-4 bg-green-800 text-white p-4 rounded-lg shadow-lg flex items-center">
          <IconCheck className="mr-2" />
          <span>{successMessage}</span>
          <button 
            className="ml-4 text-white/70 hover:text-white" 
            onClick={() => setShowSuccessNotification(false)}
          >
            <IconX size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
