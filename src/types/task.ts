export type TaskStatus =
  | "available"
  | "assigned"
  | "in_progress"
  | "completed"
  | "blocked";
export type TaskComplexity = "low" | "medium" | "high";
export type TaskCategory =
  | "NEW_FEATURE"
  | "BUG_FIX"
  | "INTEGRATION"
  | "AUTOMATION"
  | "OPTIMIZATION";

export interface TaskNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  department: string;
  compensation: number;
  priority: "high" | "medium" | "low";
  estimated_time: number;
  requirements: string[];
  acceptance_criteria: string[];
  notes?: TaskNote[];
  status: TaskStatus;
  complexity?: TaskComplexity;
  category?: TaskCategory;
  createdAt?: string;
  updatedAt?: string;
}
