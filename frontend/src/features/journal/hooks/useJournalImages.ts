import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../api/axios';
import { journalKeys } from '../api/journal.keys';
import { mapJournalImageToDomain } from '../api/journal.mapper';
import type { JournalImageDTO, JournalImageModel } from '../api/journal.types';

export const useJournalImages = () => {
  const queryClient = useQueryClient();

  const uploadImage = useMutation({
    mutationFn: async ({ entryId, file, caption, altText }: { entryId: string; file: File; caption?: string; altText?: string }) => {
      const formData = new FormData();
      formData.append('image', file);
      if (caption) formData.append('caption', caption);
      if (altText) formData.append('alt_text', altText);

      const { data } = await axiosInstance.post<JournalImageDTO>(`/journal/${entryId}/images/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return mapJournalImageToDomain(data);
    },
    onSuccess: (newImage, variables) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(variables.entryId) });
    }
  });

  const deleteImage = useMutation({
    mutationFn: async ({ entryId, imageId }: { entryId: string; imageId: string }) => {
      await axiosInstance.delete(`/journal/${entryId}/images/${imageId}/`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(variables.entryId) });
    }
  });

  return { uploadImage, deleteImage };
};
