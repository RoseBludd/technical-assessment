export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  complexity: TaskComplexity;
  compensation: number;
  description: string;
  requirements: string[];
  acceptance_criteria: string[];
  parent_task?: string;
  subtasks?: string[];
  department: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  candidateId: string;
  status: AssignmentStatus;
  startDate: Date;
  dueDate: Date;
  completedDate?: Date;
  evaluation?: TaskEvaluation;
  payment?: PaymentStatus;
}

export interface TaskEvaluation {
  speed: number;
  accuracy: number;
  communication: number;
  problem_solving: number;
  code_quality: number;
  independence: number;
  alignment: number;
  efficiency: number;
  initiative: number;
  collaboration: number;
  comments: string;
  overall_score: number;
}

export interface IntegrationStatus {
  id: string;
  departmentId: string;
  integrationId: string;
  status: IntegrationState;
  lastUpdated: Date;
  details: {
    connected: boolean;
    syncStatus: SyncStatus;
    lastSync?: Date;
    errors?: string[];
  };
}

export interface PaymentStatus {
  status: PaymentState;
  amount: number;
  processedDate?: Date;
  transactionId?: string;
}

export type TaskCategory =
  | "NEW_FEATURE"
  | "BUG_FIX"
  | "INTEGRATION"
  | "AUTOMATION"
  | "OPTIMIZATION";
export type TaskComplexity = "low" | "medium" | "high";
export type AssignmentStatus =
  | "assigned"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled";
export type IntegrationState = "pending" | "active" | "failed" | "disabled";
export type SyncStatus = "pending" | "in_progress" | "completed" | "failed";
export type PaymentState = "pending" | "processing" | "completed" | "failed";
