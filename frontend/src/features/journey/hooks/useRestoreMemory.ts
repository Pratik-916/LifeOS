import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import { NotificationService as toast } from '../../../services/notificationService';

export const useRestoreMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => JourneyAPI.restoreMemory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journeyKeys.timeline() });
      queryClient.invalidateQueries({ queryKey: journeyKeys.statistics() });
      toast.success('Memory restored');
    },
    onError: () => {
      toast.error('Failed to restore memory');
    },
  });
};
