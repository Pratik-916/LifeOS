import { useMutation, useQueryClient } from '@tanstack/react-query';
import { journeyApi } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { CreateMemoryPayload, UpdateMemoryPayload, Memory } from '../api/journey.types';
import { offlineQueue, networkService } from '../../../services/offline';
import { generateId } from '../../../utils/uuid';

export const useJourneyMutations = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: journeyKeys.all });
  };

  const createMemory = useMutation({
    onMutate: async (payload: CreateMemoryPayload) => {
      await queryClient.cancelQueries({ queryKey: journeyKeys.all });
      const previousData = queryClient.getQueryData(journeyKeys.all);
      return { previousData };
    },
    mutationFn: async (payload: CreateMemoryPayload) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journey',
          mutationType: 'CREATE',
          endpoint: '/api/v1/journey/memories/',
          method: 'POST',
          payload,
          priority: 1,
        });
        return { id: generateId(), ...payload } as unknown as Memory;
      }
      return journeyApi.createMemory(payload);
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journeyKeys.all, context.previousData);
      }
    },
    onSettled: () => {
      invalidateQueries();
    },
  });

  const updateMemory = useMutation({
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: journeyKeys.memory(id) });
      const previousData = queryClient.getQueryData<Memory>(journeyKeys.memory(id));
      if (previousData) {
        queryClient.setQueryData(journeyKeys.memory(id), { ...previousData, ...payload });
      }
      return { previousData };
    },
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateMemoryPayload }) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journey',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/journey/memories/${id}/`,
          method: 'PATCH',
          payload,
          priority: 1,
        });
        const prev = queryClient.getQueryData<Memory>(journeyKeys.memory(id));
        return { ...prev, ...payload, id } as Memory;
      }
      return journeyApi.updateMemory(id, payload);
    },
    onError: (err, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journeyKeys.memory(id), context.previousData);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.memory(id) });
      invalidateQueries();
    },
  });

  const deleteMemory = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: journeyKeys.memory(id) });
      const previousData = queryClient.getQueryData<Memory>(journeyKeys.memory(id));
      queryClient.removeQueries({ queryKey: journeyKeys.memory(id) });
      return { previousData };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journey',
          entityId: id,
          mutationType: 'DELETE',
          endpoint: `/api/v1/journey/memories/${id}/`,
          method: 'DELETE',
          priority: 1,
        });
        return;
      }
      return journeyApi.deleteMemory(id);
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journeyKeys.memory(id), context.previousData);
      }
    },
    onSettled: () => {
      invalidateQueries();
    },
  });

  const restoreMemory = useMutation({
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journey',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/journey/memories/${id}/restore/`,
          method: 'POST',
          priority: 1,
        });
        const prev = queryClient.getQueryData<Memory>(journeyKeys.memory(id));
        return { ...prev, isArchived: false } as Memory;
      }
      return journeyApi.restoreMemory(id);
    },
    onSuccess: () => {
      invalidateQueries();
    },
  });

  const favoriteMemory = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: journeyKeys.memory(id) });
      const previousData = queryClient.getQueryData<Memory>(journeyKeys.memory(id));
      if (previousData) {
        queryClient.setQueryData(journeyKeys.memory(id), { ...previousData, favorite: !previousData.favorite });
      }
      return { previousData };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journey',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/journey/memories/${id}/favorite/`,
          method: 'POST',
          priority: 1,
        });
        const prev = queryClient.getQueryData<Memory>(journeyKeys.memory(id));
        return { ...prev, favorite: !prev?.favorite } as Memory;
      }
      return journeyApi.favoriteMemory(id);
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journeyKeys.memory(id), context.previousData);
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.memory(id) });
      invalidateQueries();
    },
  });

  const pinMemory = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: journeyKeys.memory(id) });
      const previousData = queryClient.getQueryData<Memory>(journeyKeys.memory(id));
      if (previousData) {
        queryClient.setQueryData(journeyKeys.memory(id), { ...previousData, pinned: !previousData.pinned });
      }
      return { previousData };
    },
    mutationFn: async (id: string) => {
      if (!networkService.isOnline) {
        await offlineQueue.enqueue({
          entityType: 'journey',
          entityId: id,
          mutationType: 'UPDATE',
          endpoint: `/api/v1/journey/memories/${id}/pin/`,
          method: 'POST',
          priority: 1,
        });
        const prev = queryClient.getQueryData<Memory>(journeyKeys.memory(id));
        return { ...prev, pinned: !prev?.pinned } as Memory;
      }
      return journeyApi.pinMemory(id);
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(journeyKeys.memory(id), context.previousData);
      }
    },
    onSettled: (_, __, id) => {
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
