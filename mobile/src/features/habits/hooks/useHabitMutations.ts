import { useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsApi } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';
import type { CreateHabitPayload, UpdateHabitPayload, LogHabitPayload, HabitModel } from '../api/habits.types';
import { offlineQueue, networkService } from '../../../services/offline';
import { generateId } from '../../../utils/uuid';

export const useHabitMutations = () => {
  const queryClient = useQueryClient();

  const invalidateHabits = () => {
    queryClient.invalidateQueries({ queryKey: habitsKeys.all });
  };

  const createHabit = useMutation({
    onMutate: async (payload: CreateHabitPayload) => {
      await queryClient.cancelQueries({ queryKey: habitsKeys.all });
      const previousHabits = queryClient.getQueryData(habitsKeys.all);
      return { previousHabits };
    },
    mutationFn: async (payload: CreateHabitPayload) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'habit',
          mutationType: 'CREATE',
          endpoint: '/api/v1/habits/habits/',
          method: 'POST',
          payload,
          priority: 1,
        });
        return { id: generateId(), ...payload } as unknown as HabitModel;
      }
      return habitsApi.createHabit(payload);
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(habitsKeys.all, context.previousHabits);
      }
    },
    onSettled: () => {
      invalidateHabits();
    },
  });

  const updateHabit = useMutation({
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: habitsKeys.detail(id) });
      const previousHabit = queryClient.getQueryData<HabitModel>(habitsKeys.detail(id));
      if (previousHabit) {
        queryClient.setQueryData(habitsKeys.detail(id), { ...previousHabit, ...payload });
      }
      return { previousHabit };
    },
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateHabitPayload }) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'habit',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/habits/habits/${id}/`,
          method: 'PATCH',
          payload,
          priority: 1,
        });
        const prev = queryClient.getQueryData<HabitModel>(habitsKeys.detail(id));
        return { ...prev, ...payload, id } as HabitModel;
      }
      return habitsApi.updateHabit(id, payload);
    },
    onError: (err, { id }, context) => {
      if (context?.previousHabit) {
        queryClient.setQueryData(habitsKeys.detail(id), context.previousHabit);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.detail(id) });
      invalidateHabits();
    },
  });

  const deleteHabit = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: habitsKeys.detail(id) });
      const previousHabit = queryClient.getQueryData<HabitModel>(habitsKeys.detail(id));
      queryClient.removeQueries({ queryKey: habitsKeys.detail(id) });
      return { previousHabit };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'habit',
          entityId: id,
          mutationType: 'DELETE',
          endpoint: `/api/v1/habits/habits/${id}/`,
          method: 'DELETE',
          priority: 1,
        });
        return;
      }
      return habitsApi.deleteHabit(id);
    },
    onError: (err, id, context) => {
      if (context?.previousHabit) {
        queryClient.setQueryData(habitsKeys.detail(id), context.previousHabit);
      }
    },
    onSettled: () => {
      invalidateHabits();
    },
  });

  const restoreHabit = useMutation({
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'habit',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/habits/habits/${id}/restore/`,
          method: 'POST',
          priority: 1,
        });
        const prev = queryClient.getQueryData<HabitModel>(habitsKeys.detail(id));
        return { ...prev, isArchived: false } as HabitModel;
      }
      return habitsApi.restoreHabit(id);
    },
    onSuccess: (restoredHabit) => {
      queryClient.setQueryData(habitsKeys.detail(restoredHabit.id), restoredHabit);
      invalidateHabits();
    },
  });

  const archiveHabit = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: habitsKeys.detail(id) });
      const previousHabit = queryClient.getQueryData<HabitModel>(habitsKeys.detail(id));
      if (previousHabit) {
        queryClient.setQueryData(habitsKeys.detail(id), { ...previousHabit, isArchived: true });
      }
      return { previousHabit };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'habit',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/habits/habits/${id}/archive/`,
          method: 'POST',
          priority: 1,
        });
        const prev = queryClient.getQueryData<HabitModel>(habitsKeys.detail(id));
        return { ...prev, isArchived: true } as HabitModel;
      }
      return habitsApi.archiveHabit(id);
    },
    onError: (err, id, context) => {
      if (context?.previousHabit) {
        queryClient.setQueryData(habitsKeys.detail(id), context.previousHabit);
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.detail(id) });
      invalidateHabits();
    },
  });

  const favoriteHabit = useMutation({
    onMutate: async ({ id, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: habitsKeys.detail(id) });
      const previousHabit = queryClient.getQueryData<HabitModel>(habitsKeys.detail(id));
      if (previousHabit) {
        queryClient.setQueryData(habitsKeys.detail(id), { ...previousHabit, isFavorite });
      }
      return { previousHabit };
    },
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'habit',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/habits/habits/${id}/favorite/`,
          method: 'POST',
          payload: { is_favorite: isFavorite },
          priority: 1,
        });
        const prev = queryClient.getQueryData<HabitModel>(habitsKeys.detail(id));
        return { ...prev, isFavorite } as HabitModel;
      }
      return habitsApi.favoriteHabit(id, isFavorite);
    },
    onError: (err, { id }, context) => {
      if (context?.previousHabit) {
        queryClient.setQueryData(habitsKeys.detail(id), context.previousHabit);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.detail(id) });
      invalidateHabits();
    },
  });

  const logHabit = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: LogHabitPayload }) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'habit',
          entityId: id,
          mutationType: 'POST',
          endpoint: `/api/v1/habits/habits/${id}/log/`,
          method: 'POST',
          payload,
          priority: 1,
        });
        return;
      }
      return habitsApi.logHabit(id, payload);
    },
    onSuccess: () => {
      invalidateHabits();
    },
  });

  return {
    createHabit,
    updateHabit,
    deleteHabit,
    restoreHabit,
    archiveHabit,
    favoriteHabit,
    logHabit,
  };
};
