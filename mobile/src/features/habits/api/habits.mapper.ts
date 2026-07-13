import type { 
  HabitModel, HabitDTO,
  HabitLogDTO, HabitLog, 
  HabitReminderDTO, HabitReminder, 
  HabitStatsDTO, HabitStatsModel,
  PaginatedHabitsModel
} from './habits.types';

export const mapHabitLogToDomain = (dto: HabitLogDTO): HabitLog => ({
  id: dto.id,
  completionDate: dto.completion_date,
  count: dto.count,
  notes: dto.notes,
  mood: dto.mood,
  durationMinutes: dto.duration_minutes,
  createdAt: dto.created_at,
});

export const mapHabitReminderToDomain = (dto: HabitReminderDTO): HabitReminder => ({
  id: dto.id,
  reminderTime: dto.reminder_time,
  daysOfWeek: dto.days_of_week,
  isEnabled: dto.is_enabled,
});

export const mapHabitToDomain = (dto: HabitDTO): HabitModel => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  category: dto.category,
  icon: dto.icon,
  color: dto.color,
  frequency: dto.frequency,
  targetCount: dto.target_count,
  currentCount: dto.current_count,
  currentStreak: dto.current_streak,
  longestStreak: dto.longest_streak,
  completionRate: dto.completion_rate,
  reminderTime: dto.reminder_time,
  reminderEnabled: dto.reminder_enabled,
  startDate: dto.start_date,
  endDate: dto.end_date,
  status: dto.status,
  priority: dto.priority,
  isFavorite: dto.is_favorite,
  isArchived: dto.is_archived,
  tags: dto.tags || [],
  tagsDetail: dto.tags_detail || [],
  logs: (dto.logs || []).map(mapHabitLogToDomain),
  reminders: (dto.reminders || []).map(mapHabitReminderToDomain),
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapPaginatedHabitsToDomain = (dto: any): PaginatedHabitsModel => {
  if (Array.isArray(dto)) {
    return {
      count: dto.length,
      next: null,
      previous: null,
      results: dto.map(mapHabitToDomain)
    };
  }
  return {
    count: dto.count || 0,
    next: dto.next || null,
    previous: dto.previous || null,
    results: (dto.results || []).map(mapHabitToDomain),
  };
};

export const mapHabitStatsToDomain = (dto: HabitStatsDTO): HabitStatsModel => ({
  totalHabits: dto.total_today || 0,
  completedToday: dto.completed_today || 0,
  completionRate: dto.completion_percentage || 0,
  longestActiveStreak: dto.longest_streak_ever || 0,
});
