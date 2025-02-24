"use client";

import { useState } from "react";
import { Task } from "@/types/task";

interface TaskAssignmentModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => Promise<void>;
}

export const TaskAssignmentModal = ({
  task,
  isOpen,
  onClose,
  onComplete,
}: TaskAssignmentModalProps) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/tasks/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: task.id,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign task");
      }

      await onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign task");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Assign Task</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Assignment Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Add any notes or questions about the task..."
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Assigning..." : "Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
