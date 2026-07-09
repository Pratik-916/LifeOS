import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { CreateMemoryPayload } from '../api/journey.types';
import { NotificationService as toast } from '../../../services/notificationService';

export const useCreateMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMemoryPayload) => JourneyAPI.createMemory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journeyKeys.timeline() });
      queryClient.invalidateQueries({ queryKey: journeyKeys.statistics() });
      toast.success('Memory saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create memory. Please try again.');
      console.error(error);
    },
  });
};
