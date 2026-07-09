import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JournalAPI } from '../api/journal';
import { journalKeys } from '../api/journal.keys';
import type { PaginatedJournalModel } from '../api/journal.types';

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => JournalAPI.deleteJournalEntry(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: journalKeys.lists() });

      const previousData = queryClient.getQueriesData<PaginatedJournalModel>({ queryKey: journalKeys.lists() });

      queryClient.setQueriesData({ queryKey: journalKeys.lists() }, (oldData: any) => {
        if (!oldData || !oldData.results) return oldData;
        return {
          ...oldData,
          results: oldData.results.filter((entry: any) => entry.id !== id),
        };
      });

      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journalKeys.statistics() });
    },
  });
};
