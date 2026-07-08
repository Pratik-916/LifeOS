import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaginatedResponse } from '../../../types';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';
import type { Task } from '../api/planner.types';
import { NotificationService } from '../../../services/notificationService';

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      plannerApi.completeTask(id, completed),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: plannerKeys.tasks() });
      await queryClient.cancelQueries({ queryKey: plannerKeys.task(id) });

      const previousTask = queryClient.getQueryData<Task>(plannerKeys.task(id));

      const newStatus = completed ? 'completed' : 'todo';

      queryClient.setQueriesData<PaginatedResponse<Task>>({ queryKey: plannerKeys.tasks() }, (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          results: oldData.results.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        };
      });

      if (previousTask) {
        queryClient.setQueryData(plannerKeys.task(id), { ...previousTask, status: newStatus });
      }

      return { previousTask };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(plannerKeys.task(id), context.previousTask);
      }
      queryClient.invalidateQueries({ queryKey: plannerKeys.tasks() });
      NotificationService.error('Failed to update task status');
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: plannerKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: plannerKeys.task(id) });
      queryClient.invalidateQueries({ queryKey: plannerKeys.statistics() });
    },
  });
};
