export const journeyKeys = {
  all: ['journey'] as const,
  lists: () => [...journeyKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...journeyKeys.lists(), { ...filters }] as const,
  details: () => [...journeyKeys.all, 'detail'] as const,
  detail: (id: string) => [...journeyKeys.details(), id] as const,
  timeline: (filters: Record<string, any> = {}) => [...journeyKeys.all, 'timeline', { ...filters }] as const,
  statistics: () => [...journeyKeys.all, 'stats'] as const,
  images: (id: string) => [...journeyKeys.detail(id), 'images'] as const,
  dashboard: () => [...journeyKeys.all, 'dashboard'] as const,
};
