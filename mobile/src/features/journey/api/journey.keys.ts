import type { MemoryFilters, TimelineFilters } from './journey.types';

export const journeyKeys = {
  all: ['journey'] as const,
  memories: () => [...journeyKeys.all, 'memories'] as const,
  memoryLists: () => [...journeyKeys.memories(), 'list'] as const,
  memoryList: (filters: MemoryFilters) => [...journeyKeys.memoryLists(), { filters }] as const,
  memoryDetails: () => [...journeyKeys.memories(), 'detail'] as const,
  memoryDetail: (id: string) => [...journeyKeys.memoryDetails(), id] as const,
  
  timeline: () => [...journeyKeys.all, 'timeline'] as const,
  timelineList: (filters: TimelineFilters) => [...journeyKeys.timeline(), { filters }] as const,
  
  statistics: () => [...journeyKeys.all, 'statistics'] as const,
};
