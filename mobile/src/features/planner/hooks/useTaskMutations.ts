import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';
import type { Task } from '../api/planner.types';
import { offlineQueue, networkService } from '../../../services/offline';
import { mapTaskToDTO } from '../api/planner.mapper';
import { generateId } from '../../../utils/uuid';

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const invalidatePlanner = () => {
    queryClient.invalidateQueries({ queryKey: plannerKeys.all });
  };

  const createTask = useMutation({
    onMutate: async (payload: Partial<Task>) => {
      await queryClient.cancelQueries({ queryKey: plannerKeys.all });
      const previousTasks = queryClient.getQueryData(plannerKeys.all);
      
      // We could optimistically add to the first page of the paginated list, 
      // but invalidation is safer for complex paginated data.
      return { previousTasks };
    },
    mutationFn: async (payload: Partial<Task>) => {
      if (!networkService.isOnline) {
        const dtoPayload = mapTaskToDTO(payload);
        const tempId = generateId();
        await offlineQueue.enqueue({
          entityType: 'task',
          entityId: tempId,
          mutationType: 'CREATE',
          endpoint: '/api/v1/planner/tasks/',
          method: 'POST',
          payload: dtoPayload,
          priority: 1,
        });
        return { id: tempId, ...payload, status: 'todo' } as Task;
      }
      return plannerApi.createTask(payload);
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(plannerKeys.all, context.previousTasks);
      }
    },
    onSettled: () => {
      invalidatePlanner();
    },
  });

  const updateTask = useMutation({
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: plannerKeys.task(id) });
      const previousTask = queryClient.getQueryData<Task>(plannerKeys.task(id));
      
      if (previousTask) {
        const optimisticTask = { ...previousTask, ...payload };
        queryClient.setQueryData(plannerKeys.task(id), optimisticTask);
      }
      return { previousTask };
    },
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Task> }) => {
      if (!networkService.isOnline) {
        const dtoPayload = mapTaskToDTO(payload);
        await offlineQueue.enqueue({
          entityType: 'task',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/planner/tasks/${id}/`,
          method: 'PATCH',
          payload: dtoPayload,
          priority: 1,
        });
        const prev = queryClient.getQueryData<Task>(plannerKeys.task(id));
        return { ...prev, ...payload, id } as Task;
      }
      return plannerApi.updateTask(id, payload);
    },
    onError: (err, { id }, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(plannerKeys.task(id), context.previousTask);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: plannerKeys.task(id) });
      invalidatePlanner();
    },
  });

  const deleteTask = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: plannerKeys.task(id) });
      await queryClient.cancelQueries({ queryKey: plannerKeys.all });
      const previousTask = queryClient.getQueryData<Task>(plannerKeys.task(id));
      
      // Optimistically remove
      queryClient.removeQueries({ queryKey: plannerKeys.task(id) });
      return { previousTask };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'task',
          entityId: id,
          mutationType: 'DELETE',
          endpoint: `/api/v1/planner/tasks/${id}/`,
          method: 'DELETE',
          priority: 1,
        });
        return;
      }
      return plannerApi.deleteTask(id);
    },
    onError: (err, id, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(plannerKeys.task(id), context.previousTask);
      }
    },
    onSettled: () => {
      invalidatePlanner();
    },
  });

  const restoreTask = useMutation({
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'task',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/planner/tasks/${id}/restore/`,
          method: 'POST',
          priority: 1,
        });
        const prev = queryClient.getQueryData<Task>(plannerKeys.task(id));
        return { ...prev, isArchived: false } as Task;
      }
      return plannerApi.restoreTask(id);
    },
    onSuccess: (restoredTask) => {
      queryClient.setQueryData(plannerKeys.task(restoredTask.id), restoredTask);
      invalidatePlanner();
    },
  });

  const completeTask = useMutation({
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: plannerKeys.task(id) });
      const previousTask = queryClient.getQueryData<Task>(plannerKeys.task(id));
      
      if (previousTask) {
        const optimisticTask = { ...previousTask, status: completed ? 'completed' : 'todo' };
        queryClient.setQueryData(plannerKeys.task(id), optimisticTask);
      }
      return { previousTask };
    },
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const status = completed ? 'completed' : 'todo';
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'task',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/planner/tasks/${id}/`,
          method: 'PATCH',
          payload: { status },
          priority: 1,
        });
        const prev = queryClient.getQueryData<Task>(plannerKeys.task(id));
        return { ...prev, status, id } as Task;
      }
      return plannerApi.completeTask(id, completed);
    },
    onError: (err, { id }, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(plannerKeys.task(id), context.previousTask);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: plannerKeys.task(id) });
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
