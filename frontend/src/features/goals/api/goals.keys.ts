import type { GetGoalsFilters } from './goals.types';

export const goalsKeys = {
  all: () => ['goals'] as const,
  lists: () => [...goalsKeys.all(), 'list'] as const,
  list: (filters: GetGoalsFilters) => [...goalsKeys.lists(), { filters }] as const,
  details: () => [...goalsKeys.all(), 'detail'] as const,
  detail: (id: string) => [...goalsKeys.details(), id] as const,
  progress: (id: string) => [...goalsKeys.details(), id, 'progress'] as const,
  statistics: () => [...goalsKeys.all(), 'statistics'] as const,
  dashboard: () => [...goalsKeys.all(), 'dashboard'] as const,
};
