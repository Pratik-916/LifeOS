import type { HabitFilters } from './habits.types';

export const habitsKeys = {
  all: ['habits'] as const,
  lists: () => [...habitsKeys.all, 'list'] as const,
  list: (filters: HabitFilters) => [...habitsKeys.lists(), filters] as const,
  details: () => [...habitsKeys.all, 'detail'] as const,
  detail: (id: string) => [...habitsKeys.details(), id] as const,
  logs: (id: string) => [...habitsKeys.detail(id), 'logs'] as const,
  statistics: () => [...habitsKeys.all, 'statistics'] as const,
  dashboard: () => [...habitsKeys.all, 'dashboard'] as const,
};
