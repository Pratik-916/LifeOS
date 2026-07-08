import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';
import { NotificationService } from '../../../services/notificationService';

export const useRestoreTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plannerApi.restoreTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: plannerKeys.statistics() });
      NotificationService.success('Task restored successfully');
    },
    onError: () => {
      NotificationService.error('Failed to restore task');
    },
  });
};
