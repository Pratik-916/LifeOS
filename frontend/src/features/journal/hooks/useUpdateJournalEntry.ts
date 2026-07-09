import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JournalAPI } from '../api/journal';
import { journalKeys } from '../api/journal.keys';
import type { UpdateJournalEntryPayload, JournalEntryModel } from '../api/journal.types';

export const useUpdateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateJournalEntryPayload }) => 
      JournalAPI.updateJournalEntry(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: journalKeys.detail(id) });
      const previousEntry = queryClient.getQueryData<JournalEntryModel>(journalKeys.detail(id));

      if (previousEntry) {
        queryClient.setQueryData<JournalEntryModel>(journalKeys.detail(id), {
          ...previousEntry,
          ...payload, // optimistically apply known payload parts
        });
      }

      return { previousEntry };
    },
    onError: (err, variables, context) => {
      if (context?.previousEntry) {
        queryClient.setQueryData(journalKeys.detail(variables.id), context.previousEntry);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journalKeys.statistics() });
    },
  });
};
