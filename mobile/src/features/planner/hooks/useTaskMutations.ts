import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';
import type { Task } from '../api/planner.types';

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const invalidatePlanner = () => {
    queryClient.invalidateQueries({ queryKey: plannerKeys.all });
  };

  const createTask = useMutation({
    mutationFn: (payload: Partial<Task>) => plannerApi.createTask(payload),
    onSuccess: () => {
      invalidatePlanner();
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) => 
      plannerApi.updateTask(id, payload),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(plannerKeys.task(updatedTask.id), updatedTask);
      invalidatePlanner();
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => plannerApi.deleteTask(id),
    onSuccess: (_, id) => {
      // Optimistically clean up
      queryClient.removeQueries({ queryKey: plannerKeys.task(id) });
      invalidatePlanner();
    },
  });

  const restoreTask = useMutation({
    mutationFn: (id: string) => plannerApi.restoreTask(id),
    onSuccess: (restoredTask) => {
      queryClient.setQueryData(plannerKeys.task(restoredTask.id), restoredTask);
      invalidatePlanner();
    },
  });

  const completeTask = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      plannerApi.completeTask(id, completed),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(plannerKeys.task(updatedTask.id), updatedTask);
      invalidatePlanner();
    },
  });

  return {
    createTask,
    updateTask,
    deleteTask,
    restoreTask,
    completeTask,
  };
};
