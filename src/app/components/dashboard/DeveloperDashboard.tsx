"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Task as BaseTask, TaskStatus, TaskNote } from "@/types/task";
import { OnboardingChecklist } from "./OnboardingChecklist";

interface GitHubStatus {
  isConnected: boolean;
  url?: string;
  lastActivity?: string;
}

// Extend the base Task type with additional properties
interface Task extends BaseTask {
  start_date: string;
  due_date: string;
}

export const DeveloperDashboard = () => {
  const { data: session } = useSession();
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [githubStatus, setGithubStatus] = useState<GitHubStatus>({
    isConnected: false,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [taskNote, setTaskNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, githubRes] = await Promise.all([
          fetch("/api/tasks/assigned"),
          fetch("/api/developer/github-status"),
        ]);

        if (!tasksRes.ok) throw new Error("Failed to fetch assigned tasks");
        const tasksData = await tasksRes.json();
        setAssignedTasks(tasksData);

        if (githubRes.ok) {
          const githubData = await githubRes.json();
          setGithubStatus(githubData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task status");

      setAssignedTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      setError("Failed to update task status");
    }
  };

  const handleAddNote = async () => {
    if (!selectedTask || !taskNote.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: taskNote }),
      });

      if (!response.ok) throw new Error("Failed to add note");

      setTaskNote("");
      // Refresh task data
      const tasksRes = await fetch("/api/tasks/assigned");
      if (!tasksRes.ok) throw new Error("Failed to refresh tasks");
      const tasksData = await tasksRes.json();
      setAssignedTasks(tasksData);
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8 text-gray-200">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-900/50 rounded">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Profile Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Developer Dashboard
            </h1>
            <p className="mt-1 text-gray-400">
              Welcome back, {session?.user?.name}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Edit Profile
            </Link>
            <Link
              href="/tasks/pool"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Task Pool
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Onboarding and GitHub */}
          <div className="lg:col-span-1 space-y-6">
            <OnboardingChecklist />

            {/* GitHub Connection Status */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                GitHub Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Connection Status</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {githubStatus.isConnected ? "Connected" : "Not Connected"}
                    </p>
                  </div>
                  {!githubStatus.isConnected && (
                    <a
                      href="/api/auth/github"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Connect GitHub
                    </a>
                  )}
                </div>
                {githubStatus.isConnected && (
                  <div>
                    <p className="text-gray-300">Recent Activity</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Last activity:{" "}
                      {githubStatus.lastActivity
                        ? new Date(
                            githubStatus.lastActivity
                          ).toLocaleDateString()
                        : "No recent activity"}
                    </p>
                    {githubStatus.url && (
                      <a
                        href={githubStatus.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                      >
                        View GitHub Profile
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Tasks */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Current Tasks
            </h2>
            {assignedTasks.filter((t) =>
              ["assigned", "in_progress"].includes(t.status)
            ).length > 0 ? (
              <div className="space-y-4">
                {assignedTasks
                  .filter((t) => ["assigned", "in_progress"].includes(t.status))
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-700/50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {task.description}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                task.status === "assigned"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : task.status === "in_progress"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : ""
                              }`}
                            >
                              {task.status === "assigned"
                                ? "Assigned"
                                : "In Progress"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleUpdateStatus(
                                task.id,
                                e.target.value as TaskStatus
                              )
                            }
                            className="bg-gray-800 text-sm text-gray-300 rounded px-2 py-1 border border-gray-600"
                          >
                            <option value="assigned" className="text-gray-300">
                              Assigned
                            </option>
                            <option
                              value="in_progress"
                              className="text-gray-300"
                            >
                              In Progress
                            </option>
                            <option value="completed" className="text-gray-300">
                              Completed
                            </option>
                            <option value="blocked" className="text-gray-300">
                              Blocked
                            </option>
                          </select>
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setShowTaskDetails(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-400">
                        <span className="mr-4">
                          Department: {task.department}
                        </span>
                        <span>Compensation: ${task.compensation}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-400">No active tasks</p>
            )}
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedTask.title}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      selectedTask.status === "assigned"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
                    {selectedTask.status.charAt(0).toUpperCase() +
                      selectedTask.status.slice(1)}
                  </span>
                  <span className="text-gray-400">
                    Due: {new Date(selectedTask.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTaskDetails(false);
                  setSelectedTask(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-400">{selectedTask.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Requirements
                  </h3>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {selectedTask.requirements?.map((req, index) => (
                      <li key={index} className="pl-2">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Acceptance Criteria
                  </h3>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {selectedTask.acceptance_criteria?.map(
                      (criteria, index) => (
                        <li key={index} className="pl-2">
                          {criteria}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Progress Notes
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={taskNote}
                      onChange={(e) => setTaskNote(e.target.value)}
                      placeholder="Add a note about your progress..."
                      className="flex-1 bg-gray-700 text-gray-200 rounded px-3 py-2"
                    />
                    <button
                      onClick={handleAddNote}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Add Note
                    </button>
                  </div>

                  {selectedTask.notes && selectedTask.notes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTask.notes.map((note: TaskNote) => (
                        <div
                          key={note.id}
                          className="bg-gray-700/50 p-3 rounded"
                        >
                          <p className="text-gray-300">{note.content}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No progress notes yet
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Task Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <select
                        value={selectedTask.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            selectedTask.id,
                            e.target.value as TaskStatus
                          )
                        }
                        className="mt-1 w-full bg-gray-800 text-gray-200 rounded px-3 py-2 border border-gray-600"
                      >
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Department</p>
                      <p className="text-gray-200 mt-1">
                        {selectedTask.department}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Compensation</p>
                      <p className="text-gray-200 mt-1">
                        ${selectedTask.compensation}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Start Date</p>
                      <p className="text-gray-200 mt-1">
                        {new Date(selectedTask.start_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Due Date</p>
                      <p className="text-gray-200 mt-1">
                        {new Date(selectedTask.due_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Resources</p>
                      <div className="mt-2 space-y-2">
                        <a
                          href="/docs/setup-guide"
                          className="text-blue-400 hover:text-blue-300 block"
                        >
                          📄 Development Setup Guide
                        </a>
                        <a
                          href="/docs/coding-standards"
                          className="text-blue-400 hover:text-blue-300 block"
                        >
                          📄 Coding Standards
                        </a>
                        <a
                          href="/docs/testing-guide"
                          className="text-blue-400 hover:text-blue-300 block"
                        >
                          📄 Testing Guidelines
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Development Environment
                  </h3>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      All required development files and configurations are
                      pre-installed on our development server. You can access
                      them at:
                    </p>
                    <code className="block bg-gray-800 p-3 rounded text-sm text-gray-300">
                      /path/to/project/files
                    </code>
                    <p className="text-sm text-gray-400 mt-2">
                      Alternatively, you can clone the repository from GitHub:
                    </p>
                    <code className="block bg-gray-800 p-3 rounded text-sm text-gray-300">
                      git clone https://github.com/org/repo.git
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
