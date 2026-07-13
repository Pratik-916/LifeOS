import { useMutation, useQueryClient } from '@tanstack/react-query';
import { journeyApi } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { CreateMemoryPayload, UpdateMemoryPayload, MemoryModel } from '../api/journey.types';

export const useJourneyMutations = () => {
  const queryClient = useQueryClient();

  const invalidateJourneyQueries = () => {
    queryClient.invalidateQueries({ queryKey: journeyKeys.memoryLists() });
    queryClient.invalidateQueries({ queryKey: journeyKeys.timeline() });
    queryClient.invalidateQueries({ queryKey: journeyKeys.statistics() });
  };

  const createMemory = useMutation({
    mutationFn: (payload: CreateMemoryPayload) => journeyApi.createMemory(payload),
    onSuccess: () => {
      invalidateJourneyQueries();
    },
  });

  const updateMemory = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMemoryPayload }) => 
      journeyApi.updateMemory(id, payload),
    onSuccess: (data: MemoryModel) => {
      queryClient.setQueryData(journeyKeys.memoryDetail(data.id), data);
      invalidateJourneyQueries();
    },
  });

  const deleteMemory = useMutation({
    mutationFn: (id: string) => journeyApi.deleteMemory(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: journeyKeys.memoryDetail(id) });
      invalidateJourneyQueries();
    },
  });

  const restoreMemory = useMutation({
    mutationFn: (id: string) => journeyApi.restoreMemory(id),
    onSuccess: (data: MemoryModel) => {
      queryClient.setQueryData(journeyKeys.memoryDetail(data.id), data);
      invalidateJourneyQueries();
    },
  });

  const favoriteMemory = useMutation({
    mutationFn: (id: string) => journeyApi.favoriteMemory(id),
    onSuccess: () => {
      invalidateJourneyQueries();
    },
  });

  const pinMemory = useMutation({
    mutationFn: (id: string) => journeyApi.pinMemory(id),
    onSuccess: () => {
      invalidateJourneyQueries();
    },
  });

  return {
    createMemory: createMemory.mutateAsync,
    updateMemory: updateMemory.mutateAsync,
    deleteMemory: deleteMemory.mutateAsync,
    restoreMemory: restoreMemory.mutateAsync,
    favoriteMemory: favoriteMemory.mutateAsync,
    pinMemory: pinMemory.mutateAsync,
    
    isCreating: createMemory.isPending,
    isUpdating: updateMemory.isPending,
    isDeleting: deleteMemory.isPending,
  };
};
