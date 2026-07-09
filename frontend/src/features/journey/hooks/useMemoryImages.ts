import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import { NotificationService as toast } from '../../../services/notificationService';

export const useUploadMemoryImages = (memoryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => JourneyAPI.uploadMemoryImages(memoryId, formData),
    onSuccess: (data) => {
      queryClient.setQueryData(journeyKeys.detail(memoryId), data);
      queryClient.invalidateQueries({ queryKey: journeyKeys.images(memoryId) });
      toast.success('Images uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload images');
    }
  });
};

export const useDeleteMemoryImage = (memoryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => JourneyAPI.deleteMemoryImage(memoryId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.detail(memoryId) });
      queryClient.invalidateQueries({ queryKey: journeyKeys.images(memoryId) });
      toast.success('Image deleted');
    },
    onError: () => {
      toast.error('Failed to delete image');
    }
  });
};
