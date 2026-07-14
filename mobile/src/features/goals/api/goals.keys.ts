export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...goalKeys.lists(), { filters }] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
  statistics: () => [...goalKeys.all, 'statistics'] as const,
};
