import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PaginatedResponse } from '../../../types';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';
import type { Task } from '../api/planner.types';
import { NotificationService } from '../../../services/notificationService';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plannerApi.deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: plannerKeys.tasks() });

      const previousTasks = queryClient.getQueryData<PaginatedResponse<Task>>(plannerKeys.tasksList());

      queryClient.setQueriesData<PaginatedResponse<Task>>({ queryKey: plannerKeys.tasks() }, (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          results: oldData.results.filter((t) => t.id !== id)
        };
      });

      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueriesData({ queryKey: plannerKeys.tasks() }, context.previousTasks);
      }
      NotificationService.error('Failed to delete task');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: plannerKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: plannerKeys.statistics() });
    },
    onSuccess: (_, id) => {
      // The instructions require an Undo button. In this implementation, 
      // we'll trigger an event that the UI can catch to show an Undo toast.
      // We will enhance NotificationService if needed, but for now we'll dispatch it.
      window.dispatchEvent(new CustomEvent('toast:undoable-delete', { detail: { taskId: id, module: 'planner' } }));
    },
  });
};
