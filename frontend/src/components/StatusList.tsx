import type { StatusUpdate, StatusListTypes } from "../types";

// Displays system status updates with color-coding based on status type
// - Green for healthy
// - Yellow for warnings
// - Red for errors
export default function StatusList({ updates }: StatusListTypes) {
  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div
          key={update.id}
          className={`p-4 rounded-lg ${
            update.status === "healthy"
              ? "bg-green-900 border-green-700"
              : update.status === "warning"
              ? "bg-yellow-900 border-yellow-700"
              : "bg-red-900 border-red-700"
          } border`}
        >
          <div className="flex-between">
            <span className="font-bold flexible-header">
              {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
            </span>
            <span className="flexible-text opacity-75">
              {new Date(update.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="mt-2 flexible-text">{update.message}</p>
        </div>
      ))}
    </div>
  );
}