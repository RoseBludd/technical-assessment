"use client";

import { useSession } from "next-auth/react";
import { TaskPool } from "../components/tasks/TaskPool";

export default function TasksPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">Please sign in to view available tasks.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Task Pool</h1>
        <p className="text-gray-600 mt-2">
          Browse and select tasks that match your skills and interests.
        </p>
      </div>

      <TaskPool />
    </div>
  );
}
