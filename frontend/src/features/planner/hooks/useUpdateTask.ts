import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaginatedResponse } from '../../../types';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';
import type { Task } from '../api/planner.types';
import { NotificationService } from '../../../services/notificationService';

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) =>
      plannerApi.updateTask(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: plannerKeys.tasks() });
      await queryClient.cancelQueries({ queryKey: plannerKeys.task(id) });

      // Snapshot the previous value
      const previousTask = queryClient.getQueryData<Task>(plannerKeys.task(id));

      // Update the specific task in all cached lists
      queryClient.setQueriesData<PaginatedResponse<Task>>({ queryKey: plannerKeys.tasks() }, (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          results: oldData.results.map((t) => (t.id === id ? { ...t, ...payload } : t))
        };
      });

      // Update the single task cache if it exists
      if (previousTask) {
        queryClient.setQueryData(plannerKeys.task(id), { ...previousTask, ...payload });
      }

      return { previousTask };
    },
    onError: (_err, { id }, context) => {
      // Rollback
      if (context?.previousTask) {
        queryClient.setQueryData(plannerKeys.task(id), context.previousTask);
      }
      queryClient.invalidateQueries({ queryKey: plannerKeys.tasks() });
      NotificationService.error('Failed to update task');
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: plannerKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: plannerKeys.task(id) });
      queryClient.invalidateQueries({ queryKey: plannerKeys.statistics() });
    },
    onSuccess: () => {
      NotificationService.success('Task updated');
    },
  });
};
