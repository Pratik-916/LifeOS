import { useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '../api/journal';
import { journalKeys } from '../api/journal.keys';

export const useJournalMutations = () => {
  const queryClient = useQueryClient();

  const invalidateJournalQueries = () => {
    queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    queryClient.invalidateQueries({ queryKey: journalKeys.statistics() });
  };

  const createMutation = useMutation({
    mutationFn: journalApi.createJournalEntry,
    onSuccess: () => {
      invalidateJournalQueries();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof journalApi.updateJournalEntry>[1] }) =>
      journalApi.updateJournalEntry(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(journalKeys.detail(data.id), data);
      invalidateJournalQueries();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: journalApi.deleteJournalEntry,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: journalKeys.detail(id) });
      invalidateJournalQueries();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: journalApi.restoreJournalEntry,
    onSuccess: (data) => {
      queryClient.setQueryData(journalKeys.detail(data.id), data);
      invalidateJournalQueries();
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: journalApi.favoriteJournalEntry,
    onSuccess: () => {
      invalidateJournalQueries();
    },
  });

  const pinMutation = useMutation({
    mutationFn: journalApi.pinJournalEntry,
    onSuccess: () => {
      invalidateJournalQueries();
    },
  });

  return {
    createJournalEntry: createMutation.mutateAsync,
    updateJournalEntry: updateMutation.mutateAsync,
    deleteJournalEntry: deleteMutation.mutateAsync,
    restoreJournalEntry: restoreMutation.mutateAsync,
    favoriteJournalEntry: favoriteMutation.mutateAsync,
    pinJournalEntry: pinMutation.mutateAsync,
    
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
