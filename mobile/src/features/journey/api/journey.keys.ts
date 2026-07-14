import type { GetMemoriesFilters, GetTimelineFilters } from './journey';

export const journeyKeys = {
  all: ['journey'] as const,
  memories: () => [...journeyKeys.all, 'memories'] as const,
  memoriesList: (filters?: GetMemoriesFilters) => [...journeyKeys.memories(), { filters }] as const,
  memory: (id: string) => [...journeyKeys.memories(), id] as const,
  timeline: (filters?: GetTimelineFilters) => [...journeyKeys.all, 'timeline', { filters }] as const,
  statistics: () => [...journeyKeys.all, 'statistics'] as const,
};
