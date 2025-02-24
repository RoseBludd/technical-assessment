"use client";

import { useState, useEffect } from "react";
import { TaskFilters } from "@/app/components/tasks/TaskFilters";
import { TaskCard } from "@/app/components/tasks/TaskCard";
import { TaskAssignmentModal } from "@/app/components/tasks/TaskAssignmentModal";
import { Task } from "@/types/task";

export default function TaskPool() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tasks/pool");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
    } catch (err) {
      setError("Error loading tasks. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentComplete = async () => {
    setIsAssignmentModalOpen(false);
    setSelectedTask(null);
    await fetchTasks(); // Refresh task list
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...tasks];

    if (filters.department) {
      filtered = filtered.filter(
        (task) => task.department === filters.department
      );
    }

    if (filters.complexity) {
      filtered = filtered.filter(
        (task) => task.complexity === filters.complexity
      );
    }

    if (filters.category) {
      filtered = filtered.filter((task) => task.category === filters.category);
    }

    setFilteredTasks(filtered);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-red-400 p-4 bg-red-900/50 rounded">{error}</div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Task Pool</h1>

        <TaskFilters onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={handleTaskSelect} />
          ))}
        </div>

        {selectedTask && (
          <TaskAssignmentModal
            isOpen={isAssignmentModalOpen}
            onClose={() => setIsAssignmentModalOpen(false)}
            onComplete={handleAssignmentComplete}
            task={selectedTask}
          />
        )}
      </div>
    </div>
  );
}
