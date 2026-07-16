import { useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '../api/journal';
import { journalKeys } from '../api/journal.keys';
import { offlineQueue, networkService } from '../../../services/offline';
import { reminderEngine } from '../../../services/notifications/reminderEngine';
import { generateId } from '../../../utils/uuid';

export const useJournalMutations = () => {
  const queryClient = useQueryClient();

  const invalidateJournalQueries = () => {
    queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    queryClient.invalidateQueries({ queryKey: journalKeys.statistics() });
  };

  const createMutation = useMutation({
    onMutate: async (payload: Parameters<typeof journalApi.createJournalEntry>[0]) => {
      await queryClient.cancelQueries({ queryKey: journalKeys.lists() });
      const previousData = queryClient.getQueryData(journalKeys.lists());
      return { previousData };
    },
    mutationFn: async (payload: Parameters<typeof journalApi.createJournalEntry>[0]) => {
      if (!networkService.isOnline) {
        const tempId = generateId();
        await offlineQueue.enqueue({
          entityType: 'journal',
          entityId: tempId,
          mutationType: 'CREATE',
          endpoint: '/api/v1/journal/entries/',
          method: 'POST',
          payload,
          priority: 1,
        });
        return { 
          id: tempId, 
          ...payload,
          todaysWins: payload.todays_wins,
          lessonsLearned: payload.lessons_learned,
          tomorrowFocus: payload.tomorrow_focus,
          energyLevel: payload.energy_level,
          stressLevel: payload.stress_level,
        } as any;
      }
      return journalApi.createJournalEntry(payload);
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journalKeys.lists(), context.previousData);
      }
    },
    onSuccess: (entry) => {
      if (entry) reminderEngine.processJournal(entry);
    },
    onSettled: () => {
      invalidateJournalQueries();
    },
  });

  const updateMutation = useMutation({
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: journalKeys.detail(id) });
      const previousData = queryClient.getQueryData(journalKeys.detail(id));
      if (previousData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prev = previousData as any;
        queryClient.setQueryData(journalKeys.detail(id), { 
          ...prev, 
          ...payload,
          todaysWins: payload.todays_wins !== undefined ? payload.todays_wins : prev.todaysWins,
          lessonsLearned: payload.lessons_learned !== undefined ? payload.lessons_learned : prev.lessonsLearned,
          tomorrowFocus: payload.tomorrow_focus !== undefined ? payload.tomorrow_focus : prev.tomorrowFocus,
          energyLevel: payload.energy_level !== undefined ? payload.energy_level : prev.energyLevel,
          stressLevel: payload.stress_level !== undefined ? payload.stress_level : prev.stressLevel,
        });
      }
      return { previousData };
    },
    mutationFn: async ({ id, payload }: { id: string; payload: Parameters<typeof journalApi.updateJournalEntry>[1] }) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journal',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/journal/entries/${id}/`,
          method: 'PATCH',
          payload,
          priority: 1,
        });
        const prev = queryClient.getQueryData(journalKeys.detail(id)) as any;
        return { 
          ...prev, 
          ...payload, 
          id,
          todaysWins: payload.todays_wins !== undefined ? payload.todays_wins : prev?.todaysWins,
          lessonsLearned: payload.lessons_learned !== undefined ? payload.lessons_learned : prev?.lessonsLearned,
          tomorrowFocus: payload.tomorrow_focus !== undefined ? payload.tomorrow_focus : prev?.tomorrowFocus,
          energyLevel: payload.energy_level !== undefined ? payload.energy_level : prev?.energyLevel,
          stressLevel: payload.stress_level !== undefined ? payload.stress_level : prev?.stressLevel,
        } as any;
      }
      return journalApi.updateJournalEntry(id, payload);
    },
    onError: (err, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journalKeys.detail(id), context.previousData);
      }
    },
    onSuccess: (entry) => {
      if (entry) reminderEngine.processJournal(entry);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(id) });
      invalidateJournalQueries();
    },
  });

  const deleteMutation = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: journalKeys.detail(id) });
      const previousData = queryClient.getQueryData(journalKeys.detail(id));
      queryClient.removeQueries({ queryKey: journalKeys.detail(id) });
      return { previousData };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journal',
          entityId: id,
          mutationType: 'DELETE',
          endpoint: `/api/v1/journal/entries/${id}/`,
          method: 'DELETE',
          priority: 1,
        });
        return;
      }
      return journalApi.deleteJournalEntry(id);
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journalKeys.detail(id), context.previousData);
      }
    },
    onSettled: () => {
      invalidateJournalQueries();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journal',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/journal/entries/${id}/restore/`,
          method: 'POST',
          priority: 1,
        });
        const prev = queryClient.getQueryData(journalKeys.detail(id));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...(prev as any), is_archived: false } as any;
      }
      return journalApi.restoreJournalEntry(id);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(journalKeys.detail(data.id), data);
      invalidateJournalQueries();
    },
  });

  const favoriteMutation = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: journalKeys.detail(id) });
      const previousData = queryClient.getQueryData(journalKeys.detail(id));
      if (previousData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isFav = (previousData as any).is_favorite;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(journalKeys.detail(id), { ...(previousData as any), is_favorite: !isFav });
      }
      return { previousData };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journal',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/journal/entries/${id}/favorite/`,
          method: 'POST',
          priority: 1,
        });
        return;
      }
      return journalApi.favoriteJournalEntry(id);
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journalKeys.detail(id), context.previousData);
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(id) });
      invalidateJournalQueries();
    },
  });

  const pinMutation = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: journalKeys.detail(id) });
      const previousData = queryClient.getQueryData(journalKeys.detail(id));
      if (previousData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isPinned = (previousData as any).is_pinned;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(journalKeys.detail(id), { ...(previousData as any), is_pinned: !isPinned });
      }
      return { previousData };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journal',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/journal/entries/${id}/pin/`,
          method: 'POST',
          priority: 1,
        });
        return;
      }
      return journalApi.pinJournalEntry(id);
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journalKeys.detail(id), context.previousData);
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(id) });
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
