import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../api/journal';
import { journalKeys } from '../api/journal.keys';
import type { JournalFilters } from '../api/journal.types';

export const useJournalEntries = (filters: JournalFilters = {}) => {
  return useQuery({
    queryKey: journalKeys.list(filters),
    queryFn: () => journalApi.getJournalEntries(filters),
    placeholderData: (previousData) => previousData,
  });
};
