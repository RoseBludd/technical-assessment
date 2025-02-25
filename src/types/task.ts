export type TaskStatus = 'assigned' | 'in_progress' | 'completed' | 'blocked';
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

export interface TaskAttachment {
  id: string;
  type: 'video' | 'image';
  url: string;
  thumbnail_url?: string;
  created_at: string;
  title: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  department: string;
  compensation: number;
  priority: string;
  estimated_time: number;
  requirements?: string[];
  acceptance_criteria?: string[];
  notes?: TaskNote[];
  status: TaskStatus;
  complexity: string;
  category?: TaskCategory;
  createdAt?: string;
  updatedAt?: string;
  start_date: string;
  due_date: string;
  attachments?: TaskAttachment[];
}
