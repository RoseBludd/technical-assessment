"use client";

import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
}

export const TaskCard = ({ task, onSelect }: TaskCardProps) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "low":
        return "bg-green-900/20 text-green-300";
      case "medium":
        return "bg-yellow-900/20 text-yellow-300";
      case "high":
        return "bg-red-900/20 text-red-300";
      default:
        return "bg-gray-900/20 text-gray-300";
    }
  };

  const getEstimatedTime = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "low":
        return "3 days";
      case "medium":
        return "5 days";
      case "high":
        return "10 days";
      default:
        return "TBD";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{task.title}</h3>
        <div className="flex gap-2">
          {task.complexity && (
            <span
              className={`px-2 py-1 rounded text-xs ${getComplexityColor(
                task.complexity
              )}`}
            >
              {task.complexity}
            </span>
          )}
          <span
            className={`px-2 py-1 rounded text-xs ${
              task.priority === "high"
                ? "bg-red-500/20 text-red-300"
                : task.priority === "medium"
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-green-500/20 text-green-300"
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{task.description}</p>

      <div className="space-y-3 mb-6">
        <div>
          <p className="text-sm text-gray-400">Department:</p>
          <p className="text-gray-300">{task.department}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Compensation:</p>
          <p className="text-gray-300">${task.compensation}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Estimated Time:</p>
          <p className="text-gray-300">{task.estimated_time} days</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Requirements:</h4>
        <ul className="list-disc list-inside text-gray-400 space-y-1">
          {task.requirements.slice(0, 3).map((req, index) => (
            <li key={index}>{req}</li>
          ))}
          {task.requirements.length > 3 && (
            <li className="text-blue-400 cursor-pointer hover:text-blue-300">
              +{task.requirements.length - 3} more
            </li>
          )}
        </ul>
      </div>

      <button
        onClick={() => onSelect(task)}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Select Task
      </button>
    </div>
  );
};
