export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  due_date?: Date;
  created_by: number;
  assigned_to?: number;
  created_at: Date;
  updated_at: Date;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
} 