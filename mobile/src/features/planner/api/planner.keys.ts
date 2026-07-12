import type { GetTasksFilters } from './planner';

export const plannerKeys = {
  all: ['planner'] as const,
  tasks: () => [...plannerKeys.all, 'tasks'] as const,
  tasksList: (filters?: GetTasksFilters) => [...plannerKeys.tasks(), { filters }] as const,
  task: (id: string) => [...plannerKeys.tasks(), id] as const,
  statistics: () => [...plannerKeys.all, 'statistics'] as const,
};
