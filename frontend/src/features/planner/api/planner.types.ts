// src/features/planner/api/planner.types.ts

// -----------------------------------------------------------------------------
// DTOs (Data Transfer Objects) - Backend matching (snake_case)
// -----------------------------------------------------------------------------

export interface SubtaskDTO {
  id: number;
  title: string;
  is_completed: boolean;
  order: number;
}

export interface TagDTO {
  id: number;
  name: string;
  color: string;
}

export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  due_date: string | null;
  due_time: string | null;
  estimated_minutes: number;
  actual_minutes: number;
  reminder_datetime: string | null;
  is_recurring: boolean;
  recurring_type: 'daily' | 'weekly' | 'monthly' | 'yearly' | '';
  tags: number[]; // Array of tag IDs
  tags_detail?: TagDTO[];
  notes: string;
  is_archived: boolean;
  is_pinned: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  subtasks?: SubtaskDTO[];
}

export interface PlannerStatsDTO {
  total_tasks: number;
  completed: number;
  pending: number;
  overdue: number;
  due_today: number;
  due_this_week: number;
  archived: number;
  pinned: number;
  estimated_hours: number;
  actual_hours: number;
  high_priority: number;
  completion_rate: number;
  average_completion_days: number;
  productivity_score: number;
}

// -----------------------------------------------------------------------------
// Domain Models - Frontend mapping (camelCase)
// -----------------------------------------------------------------------------

export interface Subtask {
  id: string; // Map to string for frontend consistency
  title: string;
  completed: boolean;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null; // ISO format
  dueTime: string | null;
  // Note: the frontend mock used 'done', backend uses 'completed', 'in-progress' -> 'in_progress'
  status: 'todo' | 'in_progress' | 'completed';
  notes: string;
  tags: string[]; // For tag IDs or names
  tagsDetail: Tag[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  estimatedMinutes: number;
  actualMinutes: number;
  recurring: boolean;
  recurringType: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  subtasks: Subtask[];
  isArchived: boolean;
  isPinned: boolean;
}

export interface PlannerStats {
  totalTasks: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  archived: number;
  pinned: number;
  estimatedHours: number;
  actualHours: number;
  highPriority: number;
  completionRate: number;
  averageCompletionDays: number;
  productivityScore: number;
}

// For creating/updating tasks, we map Domain -> DTO before sending
export type CreateTaskPayload = Partial<TaskDTO>;
export type UpdateTaskPayload = Partial<TaskDTO>;
