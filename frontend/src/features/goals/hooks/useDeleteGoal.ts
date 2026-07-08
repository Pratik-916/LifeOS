import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalsKeys } from '../api/goals.keys';

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsApi.deleteGoal(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: goalsKeys.lists() });

      // Find all queries that match the lists key
      const previousQueries = queryClient.getQueriesData({ queryKey: goalsKeys.lists() });

      // Optimistically update all list caches
      previousQueries.forEach(([queryKey, previousData]: any) => {
        if (previousData?.results) {
          queryClient.setQueryData(queryKey, {
            ...previousData,
            results: previousData.results.filter((goal: any) => goal.id !== deletedId),
          });
        }
      });

      return { previousQueries };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, previousData]: any) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalsKeys.statistics() });
    },
  });
}
