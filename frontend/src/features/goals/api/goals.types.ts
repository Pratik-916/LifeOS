import type { PaginatedResponse, Goal, Milestone } from '../../../types';

// DTOs (Data Transfer Objects) matching the Django Backend (snake_case)
export interface MilestoneDTO {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  is_completed: boolean;
  completed_at?: string;
  order: number;
  notes?: string;
  estimated_hours?: number;
  actual_hours?: number;
  priority?: number;
}

export interface GoalDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Archived';
  target_date: string;
  start_date?: string;
  completed_at?: string;
  progress: number;
  estimated_hours?: number;
  actual_hours?: number;
  color?: string;
  icon?: string;
  is_favorite: boolean;
  is_archived: boolean;
  tags?: number[];
  tags_detail?: any[];
  milestones?: MilestoneDTO[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  last_updated_at?: string;
}

export interface GoalStatsDTO {
  total_goals: number;
  completed: number;
  active: number;
  archived: number;
  favorite: number;
  average_progress: number;
  estimated_hours: number;
  actual_hours: number;
  completed_this_month: number;
  completed_this_year: number;
  upcoming_deadlines: number;
  completion_rate: number;
}

// Request Payloads
export interface GetGoalsFilters {
  page?: number;
  status?: string;
  priority?: string;
  category?: string;
  is_favorite?: boolean;
  is_archived?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateGoalPayload {
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  target_date: string;
  color?: string;
  icon?: string;
  milestones?: Partial<MilestoneDTO>[];
}

export interface UpdateGoalPayload extends Partial<CreateGoalPayload> {
  status?: 'Not Started' | 'In Progress' | 'Completed' | 'Archived';
  progress?: number;
  is_favorite?: boolean;
  is_archived?: boolean;
  last_updated_at?: string;
}
