import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JournalAPI } from '../api/journal';
import { journalKeys } from '../api/journal.keys';

export const useRestoreJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => JournalAPI.restoreJournalEntry(id),
    onSuccess: (restoredEntry) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journalKeys.statistics() });
      queryClient.setQueryData(journalKeys.detail(restoredEntry.id), restoredEntry);
    },
  });
};
