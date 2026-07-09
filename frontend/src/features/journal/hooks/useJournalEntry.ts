import { useQuery } from '@tanstack/react-query';
import { JournalAPI } from '../api/journal';
import { journalKeys } from '../api/journal.keys';

export const useJournalEntry = (id: string) => {
  return useQuery({
    queryKey: journalKeys.detail(id),
    queryFn: () => JournalAPI.getJournalEntry(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
  });
};
