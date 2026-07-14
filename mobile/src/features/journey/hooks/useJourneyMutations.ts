import { useMutation, useQueryClient } from '@tanstack/react-query';
import { journeyApi } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { CreateMemoryPayload, UpdateMemoryPayload } from '../api/journey.types';

export const useJourneyMutations = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: journeyKeys.all });
  };

  const createMemory = useMutation({
    mutationFn: (payload: CreateMemoryPayload) => journeyApi.createMemory(payload),
    onSuccess: () => {
      invalidateQueries();
    },
  });

  const updateMemory = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMemoryPayload }) => journeyApi.updateMemory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.memory(variables.id) });
      invalidateQueries();
    },
  });

  const deleteMemory = useMutation({
    mutationFn: (id: string) => journeyApi.deleteMemory(id),
    onSuccess: () => {
      invalidateQueries();
    },
  });

  const restoreMemory = useMutation({
    mutationFn: (id: string) => journeyApi.restoreMemory(id),
    onSuccess: () => {
      invalidateQueries();
    },
  });

  const favoriteMemory = useMutation({
    mutationFn: (id: string) => journeyApi.favoriteMemory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.memory(id) });
      invalidateQueries();
    },
  });

  const pinMemory = useMutation({
    mutationFn: (id: string) => journeyApi.pinMemory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.memory(id) });
      invalidateQueries();
    },
  });

  return {
    createMemory,
    updateMemory,
    deleteMemory,
    restoreMemory,
    favoriteMemory,
    pinMemory,
  };
};
