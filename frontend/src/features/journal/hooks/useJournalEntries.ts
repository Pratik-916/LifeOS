import { useQuery } from '@tanstack/react-query';
import { JournalAPI } from '../api/journal';
import { journalKeys } from '../api/journal.keys';
import type { JournalFilters } from '../api/journal.types';

export const useJournalEntries = (filters: JournalFilters) => {
  return useQuery({
    queryKey: journalKeys.list(filters),
    queryFn: () => JournalAPI.getJournalEntries(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
