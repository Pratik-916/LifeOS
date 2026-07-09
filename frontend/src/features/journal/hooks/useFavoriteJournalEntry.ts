import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JournalAPI } from '../api/journal';
import { journalKeys } from '../api/journal.keys';
import type { JournalEntryModel } from '../api/journal.types';

export const useFavoriteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => JournalAPI.favoriteJournalEntry(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: journalKeys.all });

      const previousLists = queryClient.getQueriesData<any>({ queryKey: journalKeys.lists() });

      // Optimistically update lists
      queryClient.setQueriesData({ queryKey: journalKeys.lists() }, (oldData: any) => {
        if (!oldData || !oldData.results) return oldData;
        return {
          ...oldData,
          results: oldData.results.map((entry: JournalEntryModel) => 
            entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
          ),
        };
      });

      // Optimistically update detail
      const previousDetail = queryClient.getQueryData<JournalEntryModel>(journalKeys.detail(id));
      if (previousDetail) {
        queryClient.setQueryData<JournalEntryModel>(journalKeys.detail(id), {
          ...previousDetail,
          isFavorite: !previousDetail.isFavorite,
        });
      }

      return { previousLists, previousDetail };
    },
    onError: (err, id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(journalKeys.detail(id), context.previousDetail);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: journalKeys.dashboard() });
    },
  });
};
