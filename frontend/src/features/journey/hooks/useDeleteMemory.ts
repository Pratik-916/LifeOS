import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import { useRestoreMemory } from './useRestoreMemory';
import { NotificationService as toast } from '../../../services/notificationService';

export const useDeleteMemory = () => {
  const queryClient = useQueryClient();
  const restoreMemory = useRestoreMemory();

  return useMutation({
    mutationFn: (id: string) => JourneyAPI.deleteMemory(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: journeyKeys.all });

      // Take snapshot for rollback (timeline is complex to rollback fully, so we might just invalidate later or do simple filtering if needed)
      // Since timeline is paginated, optimistic update is hard, we just invalidate after.
      // But we can optimistically remove from lists.
      
      return { deletedId };
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journeyKeys.timeline() });
      queryClient.invalidateQueries({ queryKey: journeyKeys.statistics() });
      
      toast.success('Memory deleted');
    },
    onError: () => {
      toast.error('Failed to delete memory.');
      queryClient.invalidateQueries({ queryKey: journeyKeys.all });
    },
  });
};
