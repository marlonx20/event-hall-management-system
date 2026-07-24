export type TaskStatus =
  | "pending"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface Task {
  id: number;
  venue_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_to: string | null;
  notes: string | null;
}

export interface TaskCreate {
  title: string;
  description: string | null;
  due_date: string | null;
  priority: TaskPriority;
  assigned_to: string | null;
  notes: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigned_to?: string | null;
  notes?: string | null;
}