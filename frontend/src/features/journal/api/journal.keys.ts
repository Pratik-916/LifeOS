import type { JournalFilters } from './journal.types';

export const journalKeys = {
  all: ['journal'] as const,
  lists: () => [...journalKeys.all, 'list'] as const,
  list: (filters: JournalFilters) => [...journalKeys.lists(), filters] as const,
  details: () => [...journalKeys.all, 'detail'] as const,
  detail: (id: string) => [...journalKeys.details(), id] as const,
  statistics: () => [...journalKeys.all, 'statistics'] as const,
  images: (id: string) => [...journalKeys.detail(id), 'images'] as const,
  dashboard: () => [...journalKeys.all, 'dashboard'] as const,
};
