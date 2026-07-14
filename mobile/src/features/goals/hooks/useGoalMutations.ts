import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalKeys } from '../api/goals.keys';
import type { CreateGoalPayload, UpdateGoalPayload, Goal } from '../api/goals.types';

export const useGoalMutations = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
    queryClient.invalidateQueries({ queryKey: goalKeys.statistics() });
  };

  const createGoal = useMutation({
    mutationFn: (payload: CreateGoalPayload) => goalsApi.createGoal(payload),
    onSuccess: () => invalidateQueries(),
  });

  const updateGoal = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) => goalsApi.updateGoal(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(goalKeys.detail(data.id), data);
      invalidateQueries();
    },
  });

  const deleteGoal = useMutation({
    mutationFn: (id: string) => goalsApi.deleteGoal(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: goalKeys.detail(id) });
      invalidateQueries();
    },
  });

  const restoreGoal = useMutation({
    mutationFn: (id: string) => goalsApi.restoreGoal(id),
    onSuccess: () => invalidateQueries(),
  });

  const archiveGoal = useMutation({
    mutationFn: (id: string) => goalsApi.archiveGoal(id),
    onSuccess: (data) => {
      queryClient.setQueryData(goalKeys.detail(data.id), data);
      invalidateQueries();
    },
  });

  const favoriteGoal = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) => goalsApi.favoriteGoal(id, isFavorite),
    onMutate: async ({ id, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.lists() });
      const previousData = queryClient.getQueryData(goalKeys.lists());

      // Try optimistic update on lists if structure is flat (fallback to invalidation later)
      queryClient.setQueriesData({ queryKey: goalKeys.lists() }, (oldData: unknown) => {
        if (!oldData || !oldData.results) return oldData;
        return {
          ...oldData,
          results: oldData.results.map((goal: Goal) => 
            goal.id === id ? { ...goal, favorite: isFavorite } : goal
          )
        };
      });

      return { previousData };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(goalKeys.detail(data.id), data);
      invalidateQueries();
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueriesData({ queryKey: goalKeys.lists() }, context.previousData);
      }
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
