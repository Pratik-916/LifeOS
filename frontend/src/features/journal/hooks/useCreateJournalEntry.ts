import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JournalAPI } from '../api/journal';
import { journalKeys } from '../api/journal.keys';
import type { CreateJournalEntryPayload, JournalEntryModel } from '../api/journal.types';

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJournalEntryPayload) => JournalAPI.createJournalEntry(payload),
    onSuccess: (newEntry) => {
      // Optimistically update lists so UI doesn't flicker when activeEntryId changes
      queryClient.setQueriesData({ queryKey: journalKeys.lists() }, (oldData: any) => {
        if (!oldData || !oldData.results) return oldData;
        return {
          ...oldData,
          results: [newEntry, ...oldData.results]
        };
      });
      
      // Invalidate lists to fetch the true latest state
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journalKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: journalKeys.dashboard() });
      
      // Seed the detail cache
      queryClient.setQueryData(journalKeys.detail(newEntry.id), newEntry);
    },
  });
};
