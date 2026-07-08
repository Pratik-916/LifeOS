import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';
import type { Task } from '../api/planner.types';
import { NotificationService } from '../../../services/notificationService';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Task>) => plannerApi.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: plannerKeys.statistics() });
      NotificationService.success('Task created successfully');
    },
    onError: () => {
      NotificationService.error('Failed to create task');
    },
  });
};
