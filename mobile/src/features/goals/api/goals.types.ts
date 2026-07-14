export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  progress: number;
  milestones: Milestone[];
  tags: string[];
  notes: string;
  color?: string;
  icon?: string;
  favorite: boolean;
  estimatedHours?: number;
  actualHours?: number;
}

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
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'archived';
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
  tags_detail?: unknown[];
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
  priority: 'low' | 'medium' | 'high';
  target_date: string;
  color?: string;
  icon?: string;
  milestones?: Partial<MilestoneDTO>[];
}

export interface UpdateGoalPayload extends Partial<CreateGoalPayload> {
  status?: 'not_started' | 'in_progress' | 'completed' | 'archived';
  progress?: number;
  is_favorite?: boolean;
  is_archived?: boolean;
  last_updated_at?: string;
}
