"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Task as BaseTask, TaskNote, TaskStatus } from "@/types/task";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { formatDistanceToNow } from 'date-fns';

interface GitHubStatus {
  isConnected: boolean;
  url?: string;
  lastActivity?: string;
}

interface EnvironmentStatus {
  vpn: boolean;
  workspace: boolean;
  github: boolean;
  ide: boolean;
}

interface RequiredComponent {
  path: string;
  type: string;
}

interface WorkspaceInfo {
  workspace_id: string;
  workspace_path: string;
  setup_completed: boolean;
  assigned_at: string;
  repository: string;
  branch: string;
  required_components: RequiredComponent[];
  external: string[];
  internal: string[];
}

interface TaskAttachment {
  id: string;
  type: 'video' | 'image';
  url: string;
  thumbnail_url?: string;
  created_at: string;
  title: string;
}

// Omit the notes field from BaseTask and extend with our own version
interface DashboardTask extends Omit<BaseTask, 'notes'> {
  start_date: string;
  due_date: string;
  notes?: string | TaskNote[];
}

export const DeveloperDashboard = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedTasks, setAssignedTasks] = useState<DashboardTask[]>([]);
  const [githubStatus, setGithubStatus] = useState<GitHubStatus>({
    isConnected: false,
  });
  const [selectedTask, setSelectedTask] = useState<DashboardTask | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [taskNote, setTaskNote] = useState("");
  const [environmentStatus, setEnvironmentStatus] = useState<EnvironmentStatus>({
    vpn: false,
    workspace: false,
    github: false,
    ide: false
  });
  const [checkingEnv, setCheckingEnv] = useState(false);
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, githubRes, envRes] = await Promise.all([
          fetch("/api/tasks/assigned"),
          fetch("/api/developer/github-status"),
          fetch("/api/environment/status"),
        ]);

        if (!tasksRes.ok) throw new Error("Failed to fetch assigned tasks");
        const tasksData = await tasksRes.json();
        setAssignedTasks(tasksData);

        if (githubRes.ok) {
          const githubData = await githubRes.json();
          setGithubStatus(githubData);
        }

        if (envRes.ok) {
          const envData = await envRes.json();
          setEnvironmentStatus(envData);
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

  const handleEnvironmentCheck = async () => {
    setCheckingEnv(true);
    try {
      const response = await fetch('/api/environment/check', { method: 'POST' });
      const data = await response.json();
      setEnvironmentStatus(data);
    } catch (error) {
      console.error('Environment check failed:', error);
    } finally {
      setCheckingEnv(false);
    }
  };

  const handleConnectWorkspace = async (taskId: string) => {
    try {
      const response = await fetch(`/api/workspace/connect/${taskId}`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        // Refresh environment status
        const envResponse = await fetch('/api/environment/status');
        const envData = await envResponse.json();
        setEnvironmentStatus(envData);
      }
    } catch (error) {
      console.error('Failed to connect workspace:', error);
    }
  };

  const handleFileUpload = async (file: File, type: 'video' | 'image') => {
    if (!selectedTask) return;
    
    setAttachmentUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('taskId', selectedTask.id);

      const response = await fetch('/api/tasks/attachments', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload file');

      // Refresh task data to get new attachments
      const tasksRes = await fetch("/api/tasks/assigned");
      if (!tasksRes.ok) throw new Error("Failed to refresh tasks");
      const tasksData = await tasksRes.json();
      setAssignedTasks(tasksData);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setAttachmentUploading(false);
      setSelectedFile(null);
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Date unknown';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date unknown';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Date unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-900/50 rounded">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Developer Portal</h1>
              <span className="ml-4 text-sm text-gray-400">Welcome, {session?.user?.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/profile'} 
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button 
                onClick={() => window.location.href = '/tasks/pool'} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Task Pool
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Actions Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleEnvironmentCheck}
              disabled={checkingEnv}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {checkingEnv ? 'Checking Environment...' : 'Check Environment'}
            </button>
            <button
              onClick={() => window.location.href = '/workspace/connect'}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Connect Workspace
            </button>
            <button
              onClick={() => window.location.href = '/support'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Get Help
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {!environmentStatus.vpn && (
              <span className="text-red-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                VPN Not Connected
              </span>
            )}
            {!environmentStatus.workspace && (
              <span className="text-red-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Workspace Not Ready
              </span>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Current Task */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Current Task</h2>
                {assignedTasks.length > 0 && (
                  <select 
                    className="bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm border border-gray-600"
                    onChange={(e) => {/* Add filter handler */}}
                  >
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
          </div>

              {assignedTasks.length > 0 ? (
              <div className="space-y-4">
                  {assignedTasks[0] && (
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-white">{assignedTasks[0].title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{assignedTasks[0].description}</p>
                          <div className="mt-2 flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs rounded ${
                              assignedTasks[0].status === "assigned" ? "bg-yellow-500/20 text-yellow-300" :
                              assignedTasks[0].status === "in_progress" ? "bg-blue-500/20 text-blue-300" :
                              "bg-green-500/20 text-green-300"
                            }`}>
                              {assignedTasks[0].status.charAt(0).toUpperCase() + assignedTasks[0].status.slice(1)}
                            </span>
                            <span className="text-gray-400">Due: {new Date(assignedTasks[0].due_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleConnectWorkspace(assignedTasks[0].id)}
                            className="px-3 py-1 bg-blue-600 text-sm text-white rounded hover:bg-blue-700"
                          >
                            Connect
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTask(assignedTasks[0]);
                              setShowTaskDetails(true);
                            }}
                            className="px-3 py-1 bg-gray-600 text-sm text-white rounded hover:bg-gray-500"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-700/20 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-200">No Active Tasks</h3>
                  <p className="mt-2 text-sm text-gray-400 max-w-sm mx-auto">
                    Ready to start working? Check out the task pool to find and claim your next project.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => window.location.href = '/tasks/pool'}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Browse Available Tasks
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Environment Status */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Environment Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">VPN</span>
                  <span className={environmentStatus.vpn ? "text-green-400" : "text-red-400"}>
                    {environmentStatus.vpn ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Workspace</span>
                  <span className={environmentStatus.workspace ? "text-green-400" : "text-red-400"}>
                    {environmentStatus.workspace ? "Ready" : "Not Ready"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">GitHub</span>
                  <span className={environmentStatus.github ? "text-green-400" : "text-red-400"}>
                    {environmentStatus.github ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">IDE</span>
                  <span className={environmentStatus.ide ? "text-green-400" : "text-red-400"}>
                    {environmentStatus.ide ? "Ready" : "Not Ready"}
                  </span>
                </div>
              </div>
              {!Object.values(environmentStatus).every(Boolean) && (
                <button
                  onClick={() => window.location.href = '/setup-guide'}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Setup Environment
                </button>
              )}
            </div>

            {/* GitHub Status */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">GitHub</h2>
                {!githubStatus.isConnected && (
                  <a
                    href="/api/auth/github"
                    className="px-3 py-1 bg-blue-600 text-sm text-white rounded hover:bg-blue-700"
                  >
                    Connect
                  </a>
                )}
              </div>
              {githubStatus.isConnected && (
                <div className="text-sm text-gray-400">
                  <p>Last activity: {githubStatus.lastActivity ? new Date(githubStatus.lastActivity).toLocaleDateString() : 'No recent activity'}</p>
                  {githubStatus.url && (
                    <a href={githubStatus.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                      View Profile
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                <a href="/docs/setup-guide" className="block text-blue-400 hover:text-blue-300">📄 Setup Guide</a>
                <a href="/docs/coding-standards" className="block text-blue-400 hover:text-blue-300">📄 Coding Standards</a>
                <a href="/docs/testing-guide" className="block text-blue-400 hover:text-blue-300">📄 Testing Guidelines</a>
                <a href="/docs/workflow" className="block text-blue-400 hover:text-blue-300">📄 Workflow Guide</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">{selectedTask.title}</h2>
                  <span className={`px-2 py-1 text-sm rounded ${
                    selectedTask.status === "assigned" ? "bg-yellow-500/20 text-yellow-300" :
                    selectedTask.status === "in_progress" ? "bg-blue-500/20 text-blue-300" :
                    "bg-green-500/20 text-green-300"
                  }`}>
                    {selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">Due: {new Date(selectedTask.due_date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setShowTaskDetails(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <p className="text-gray-300">{selectedTask.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Requirements</h3>
                  {typeof selectedTask.notes === 'string' && (
                    <div className="space-y-4">
                      {(() => {
                        try {
                          const info: WorkspaceInfo = JSON.parse(selectedTask.notes);
                          return (
                            <>
                              <div className="bg-gray-700/30 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Workspace Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p className="text-gray-400">
                                    <span className="text-gray-300">ID:</span> {info.workspace_id}
                                  </p>
                                  <p className="text-gray-400">
                                    <span className="text-gray-300">Path:</span> {info.workspace_path}
                                  </p>
                                  <p className="text-gray-400">
                                    <span className="text-gray-300">Repository:</span>{' '}
                                    <a href={info.repository} target="_blank" rel="noopener noreferrer" 
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      {info.repository.split('/').pop()}
                                    </a>
                                  </p>
                                  <p className="text-gray-400">
                                    <span className="text-gray-300">Branch:</span> {info.branch}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-gray-700/30 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Required Components</h4>
                                <div className="space-y-1">
                                  {info.required_components.map((comp, idx) => (
                                    <div key={idx} className="text-sm text-gray-400">
                                      • {comp.path}
                                    </div>
                                  ))}
                                </div>
                </div>

                              <div className="bg-gray-700/30 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Dependencies</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="text-sm text-gray-400 mb-1">External</h5>
                                    <div className="space-y-1">
                                      {info.external.map((dep, idx) => (
                                        <div key={idx} className="text-sm text-gray-400">
                                          • {dep}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                <div>
                                    <h5 className="text-sm text-gray-400 mb-1">Internal</h5>
                                    <div className="space-y-1">
                                      {info.internal.map((dep, idx) => (
                                        <div key={idx} className="text-sm text-gray-400">
                                          • {dep}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        } catch (e) {
                          return (
                            <div className="text-gray-400">
                              Unable to parse requirements information
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>

                {/* Progress Notes and Attachments */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Progress Updates</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                    <input
                      type="text"
                      value={taskNote}
                      onChange={(e) => setTaskNote(e.target.value)}
                      placeholder="Add a note about your progress..."
                        className="flex-1 bg-gray-700 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddNote}
                        disabled={!taskNote.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      Add Note
                    </button>
                  </div>

                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={videoInputRef}
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'video');
                        }}
                      />
                      <input
                        type="file"
                        ref={imageInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'image');
                        }}
                      />
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        disabled={attachmentUploading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center disabled:opacity-50"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Record Screen
                      </button>
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        disabled={attachmentUploading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Add Screenshot
                      </button>
                    </div>
                    
                    {attachmentUploading && (
                      <div className="text-sm text-gray-400 flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Uploading attachment...
                      </div>
                    )}

                    {Array.isArray(selectedTask.notes) && selectedTask.notes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTask.notes.map((note: TaskNote) => (
                          <div key={note.id} className="bg-gray-700/30 p-4 rounded-lg">
                          <p className="text-gray-300">{note.content}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {formatDate(note.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                      <p className="text-gray-500 italic">No progress updates yet</p>
                    )}

                    {/* Attachments Grid */}
                    {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Attachments</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedTask.attachments.map((attachment: TaskAttachment) => (
                            <div key={attachment.id} className="bg-gray-700/30 rounded-lg overflow-hidden">
                              {attachment.type === 'video' ? (
                                <video 
                                  className="w-full h-32 object-cover"
                                  src={attachment.url}
                                  controls
                                />
                              ) : (
                                <img 
                                  src={attachment.url}
                                  alt={attachment.title}
                                  className="w-full h-32 object-cover"
                                />
                              )}
                              <div className="p-2">
                                <p className="text-sm text-gray-300 truncate">{attachment.title}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(attachment.created_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Requirements Section */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Requirements</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedTask.requirements?.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="mt-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Acceptance Criteria</h4>
                      <ul className="space-y-2">
                        {selectedTask.acceptance_criteria?.map((criteria, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="mt-1">•</span>
                            <span>{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Task Details */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Task Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Status</label>
                      <select
                        value={selectedTask.status}
                        onChange={(e) => handleUpdateStatus(selectedTask.id, e.target.value as TaskStatus)}
                        className="w-full bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm border border-gray-600"
                      >
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Department</label>
                      <p className="text-gray-300">{selectedTask.department}</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Compensation</label>
                      <p className="text-gray-300">${selectedTask.compensation}</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                      <p className="text-gray-300">
                        {selectedTask.start_date ? new Date(selectedTask.start_date).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                      <p className="text-gray-300">
                        {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Development Environment */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Development Environment</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    All required development files and configurations are pre-installed on our development server.
                  </p>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => handleConnectWorkspace(selectedTask.id)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Connect to Workspace
                    </button>

                    <div className="text-sm text-gray-400">
                      <p className="font-medium text-gray-300 mb-2">Resources</p>
                      <div className="space-y-2">
                        <a href="/docs/setup-guide" className="block text-blue-400 hover:text-blue-300">
                          📄 Development Setup Guide
                        </a>
                        <a href="/docs/coding-standards" className="block text-blue-400 hover:text-blue-300">
                          📄 Coding Standards
                        </a>
                        <a href="/docs/testing-guide" className="block text-blue-400 hover:text-blue-300">
                          📄 Testing Guidelines
                        </a>
                      </div>
                    </div>
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
