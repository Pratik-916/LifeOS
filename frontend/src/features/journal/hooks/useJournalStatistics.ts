import { useQuery } from '@tanstack/react-query';
import { JournalAPI } from '../api/journal';
import { journalKeys } from '../api/journal.keys';

export const useJournalStatistics = () => {
  return useQuery({
    queryKey: journalKeys.statistics(),
    queryFn: () => JournalAPI.getJournalStatistics(),
    staleTime: 10 * 1000, // 10 seconds
  });
};
