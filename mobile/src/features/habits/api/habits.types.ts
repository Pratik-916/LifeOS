// Backend DTOs (Snake Case)
export interface HabitReminderDTO {
  id: number;
  reminder_time: string;
  days_of_week: number[];
  is_enabled: boolean;
}

export interface HabitLogDTO {
  id: string;
  completion_date: string;
  count: number;
  notes: string;
  mood: string;
  duration_minutes: number | null;
  created_at: string;
}

export interface HabitDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  target_count: number;
  current_count: number;
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  reminder_time: string | null;
  reminder_enabled: boolean;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'paused' | 'archived';
  priority: 'low' | 'medium' | 'high';
  is_favorite: boolean;
  is_archived: boolean;
  tags: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags_detail: any[];
  logs: HabitLogDTO[];
  reminders: HabitReminderDTO[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface HabitStatsDTO {
  total_today: number;
  completed_today: number;
  completion_percentage: number;
  longest_streak_ever: number;
  pending_today: number;
  current_streak_sum: number;
}

export interface PaginatedHabitsDTO {
  count: number;
  next: string | null;
  previous: string | null;
  results: HabitDTO[];
}

// Frontend Domain Models (Camel Case)
export interface HabitLog {
  id: string;
  completionDate: string;
  count: number;
  notes: string;
  mood: string;
  durationMinutes: number | null;
  createdAt: string;
}

export interface HabitReminder {
  id: number;
  reminderTime: string;
  daysOfWeek: number[];
  isEnabled: boolean;
}

export interface HabitModel {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  targetCount: number;
  currentCount: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  reminderTime: string | null;
  reminderEnabled: boolean;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'paused' | 'archived';
  priority: 'low' | 'medium' | 'high';
  isFavorite: boolean;
  isArchived: boolean;
  tags: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tagsDetail: any[];
  logs: HabitLog[];
  reminders: HabitReminder[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface HabitStatsModel {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  longestActiveStreak: number;
}

export interface PaginatedHabitsModel {
  count: number;
  next: string | null;
  previous: string | null;
  results: HabitModel[];
}

// Request Payloads
export interface HabitFilters {
  search?: string;
  status?: string;
  category?: string;
  is_favorite?: boolean;
  is_archived?: boolean;
  frequency?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CreateHabitPayload {
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
  frequency?: 'daily' | 'weekly';
  target_count?: number;
  reminder_time?: string;
  reminder_enabled?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateHabitPayload extends Partial<CreateHabitPayload> {
  status?: 'active' | 'paused' | 'archived';
  is_favorite?: boolean;
  is_archived?: boolean;
}

export interface LogHabitPayload {
  completion_date?: string; // YYYY-MM-DD
  count?: number;
  notes?: string;
  mood?: string;
  duration_minutes?: number;
}
