import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { UpdateMemoryPayload, MemoryModel } from '../api/journey.types';
import { NotificationService as toast } from '../../../services/notificationService';

export const useUpdateMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMemoryPayload }) => 
      JourneyAPI.updateMemory(id, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(journeyKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: journeyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journeyKeys.timeline() });
      toast.success('Memory updated');
    },
    onError: (error) => {
      toast.error('Failed to update memory.');
      console.error(error);
    },
  });
};
