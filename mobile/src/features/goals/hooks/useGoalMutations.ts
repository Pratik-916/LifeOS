import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalKeys } from '../api/goals.keys';
import type { CreateGoalPayload, UpdateGoalPayload, Goal } from '../api/goals.types';
import { offlineQueue, networkService } from '../../../services/offline';
import { reminderEngine } from '../../../services/notifications/reminderEngine';
import { generateId } from '../../../utils/uuid';

export const useGoalMutations = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
    queryClient.invalidateQueries({ queryKey: goalKeys.statistics() });
  };

  const createGoal = useMutation({
    onMutate: async (payload: CreateGoalPayload) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.lists() });
      const previousData = queryClient.getQueryData(goalKeys.lists());
      return { previousData };
    },
    mutationFn: async (payload: CreateGoalPayload) => {
      if (!networkService.isOnline) {
        const tempId = generateId();
        await offlineQueue.enqueue({
          entityType: 'goal',
          entityId: tempId,
          mutationType: 'CREATE',
          endpoint: '/api/v1/goals/goals/',
          method: 'POST',
          payload,
          priority: 1,
        });
        return { id: tempId, ...payload } as unknown as Goal;
      }
      return goalsApi.createGoal(payload);
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(goalKeys.lists(), context.previousData);
      }
    },
    onSuccess: (goal) => {
      if (goal) reminderEngine.processGoal(goal);
    },
    onSettled: () => {
      invalidateQueries();
    },
  });

  const updateGoal = useMutation({
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.detail(id) });
      const previousGoal = queryClient.getQueryData<Goal>(goalKeys.detail(id));
      if (previousGoal) {
        queryClient.setQueryData(goalKeys.detail(id), { ...previousGoal, ...payload });
      }
      return { previousGoal };
    },
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateGoalPayload }) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'goal',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/goals/goals/${id}/`,
          method: 'PATCH',
          payload,
          priority: 1,
        });
        const prev = queryClient.getQueryData<Goal>(goalKeys.detail(id));
        return { ...prev, ...payload, id } as Goal;
      }
      return goalsApi.updateGoal(id, payload);
    },
    onError: (err, { id }, context) => {
      if (context?.previousGoal) {
        queryClient.setQueryData(goalKeys.detail(id), context.previousGoal);
      }
    },
    onSuccess: (goal) => {
      if (goal) reminderEngine.processGoal(goal);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) });
      invalidateQueries();
    },
  });

  const deleteGoal = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.detail(id) });
      const previousGoal = queryClient.getQueryData<Goal>(goalKeys.detail(id));
      queryClient.removeQueries({ queryKey: goalKeys.detail(id) });
      return { previousGoal };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'goal',
          entityId: id,
          mutationType: 'DELETE',
          endpoint: `/api/v1/goals/goals/${id}/`,
          method: 'DELETE',
          priority: 1,
        });
        return;
      }
      return goalsApi.deleteGoal(id);
    },
    onError: (err, id, context) => {
      if (context?.previousGoal) {
        queryClient.setQueryData(goalKeys.detail(id), context.previousGoal);
      }
    },
    onSuccess: (_, id) => {
      reminderEngine.processGoal({ id, status: 'archived' } as Goal);
    },
    onSettled: () => {
      invalidateQueries();
    },
  });

  const restoreGoal = useMutation({
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'goal',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/goals/goals/${id}/restore/`,
          method: 'POST',
          priority: 1,
        });
        const prev = queryClient.getQueryData<Goal>(goalKeys.detail(id));
        return { ...prev, status: 'active' } as Goal; // Assuming restore makes it active
      }
      return goalsApi.restoreGoal(id);
    },
    onSuccess: () => invalidateQueries(),
  });

  const archiveGoal = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.detail(id) });
      const previousGoal = queryClient.getQueryData<Goal>(goalKeys.detail(id));
      if (previousGoal) {
        queryClient.setQueryData(goalKeys.detail(id), { ...previousGoal, status: 'archived' });
      }
      return { previousGoal };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'goal',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/goals/goals/${id}/archive/`,
          method: 'POST',
          priority: 1,
        });
        const prev = queryClient.getQueryData<Goal>(goalKeys.detail(id));
        return { ...prev, status: 'archived' } as Goal;
      }
      return goalsApi.archiveGoal(id);
    },
    onError: (err, id, context) => {
      if (context?.previousGoal) {
        queryClient.setQueryData(goalKeys.detail(id), context.previousGoal);
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) });
      invalidateQueries();
    },
  });

  const favoriteGoal = useMutation({
    onMutate: async ({ id, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.lists() });
      const previousData = queryClient.getQueryData(goalKeys.lists());

      queryClient.setQueriesData({ queryKey: goalKeys.lists() }, (oldData: unknown) => {
        if (!oldData || !(oldData as { results: Goal[] }).results) return oldData;
        return {
          ...oldData,
          results: (oldData as { results: Goal[] }).results.map((goal: Goal) => 
            goal.id === id ? { ...goal, isFavorite } : goal
          )
        };
      });
      return { previousData };
    },
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'goal',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/goals/goals/${id}/favorite/`,
          method: 'POST',
          payload: { is_favorite: isFavorite },
          priority: 1,
        });
        const prev = queryClient.getQueryData<Goal>(goalKeys.detail(id));
        return { ...prev, isFavorite } as Goal;
      }
      return goalsApi.favoriteGoal(id, isFavorite);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(goalKeys.detail(data.id), data);
      reminderEngine.processGoal(data);
      invalidateQueries();
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueriesData({ queryKey: goalKeys.lists() }, context.previousData);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) });
      invalidateQueries();
    }
  });

  return {
    createGoal: createGoal.mutateAsync,
    updateGoal: updateGoal.mutateAsync,
    deleteGoal: deleteGoal.mutateAsync,
    restoreGoal: restoreGoal.mutateAsync,
    archiveGoal: archiveGoal.mutateAsync,
    favoriteGoal: favoriteGoal.mutateAsync,
    isCreating: createGoal.isPending,
    isUpdating: updateGoal.isPending,
  };
};
