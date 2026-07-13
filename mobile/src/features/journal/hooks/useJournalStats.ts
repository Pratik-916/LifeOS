import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../api/journal';
import { journalKeys } from '../api/journal.keys';

export const useJournalStats = () => {
  return useQuery({
    queryKey: journalKeys.statistics(),
    queryFn: () => journalApi.getJournalStatistics(),
  });
};
