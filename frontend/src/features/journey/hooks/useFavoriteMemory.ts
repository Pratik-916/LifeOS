import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { MemoryModel } from '../api/journey.types';
import { NotificationService as toast } from '../../../services/notificationService';

export const useFavoriteMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => JourneyAPI.favoriteMemory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: journeyKeys.detail(id) });
      const previous = queryClient.getQueryData<MemoryModel>(journeyKeys.detail(id));
      
      if (previous) {
        queryClient.setQueryData<MemoryModel>(journeyKeys.detail(id), {
          ...previous,
          favorite: !previous.favorite
        });
      }
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journeyKeys.timeline() });
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(journeyKeys.detail(id), context.previous);
      }
      toast.error('Failed to update favorite status');
    }
  });
};
