import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../api/journal';
import { journalKeys } from '../api/journal.keys';

export const useJournalEntry = (id: string, enabled = true) => {
  return useQuery({
    queryKey: journalKeys.detail(id),
    queryFn: () => journalApi.getJournalEntry(id),
    enabled: !!id && enabled,
  });
};
