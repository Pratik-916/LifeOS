import { useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsApi } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';
import type { CreateHabitPayload, UpdateHabitPayload, LogHabitPayload } from '../api/habits.types';

export const useHabitMutations = () => {
  const queryClient = useQueryClient();

  const invalidateHabits = () => {
    queryClient.invalidateQueries({ queryKey: habitsKeys.all });
  };

  const createHabit = useMutation({
    mutationFn: (payload: CreateHabitPayload) => habitsApi.createHabit(payload),
    onSuccess: () => invalidateHabits(),
  });

  const updateHabit = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHabitPayload }) => 
      habitsApi.updateHabit(id, payload),
    onSuccess: (updatedHabit) => {
      queryClient.setQueryData(habitsKeys.detail(updatedHabit.id), updatedHabit);
      invalidateHabits();
    },
  });

  const deleteHabit = useMutation({
    mutationFn: (id: string) => habitsApi.deleteHabit(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: habitsKeys.detail(id) });
      invalidateHabits();
    },
  });

  const restoreHabit = useMutation({
    mutationFn: (id: string) => habitsApi.restoreHabit(id),
    onSuccess: (restoredHabit) => {
      queryClient.setQueryData(habitsKeys.detail(restoredHabit.id), restoredHabit);
      invalidateHabits();
    },
  });

  const archiveHabit = useMutation({
    mutationFn: (id: string) => habitsApi.archiveHabit(id),
    onSuccess: (archivedHabit) => {
      queryClient.setQueryData(habitsKeys.detail(archivedHabit.id), archivedHabit);
      invalidateHabits();
    },
  });

  const favoriteHabit = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) => 
      habitsApi.favoriteHabit(id, isFavorite),
    onSuccess: (updatedHabit) => {
      queryClient.setQueryData(habitsKeys.detail(updatedHabit.id), updatedHabit);
      invalidateHabits();
    },
  });

  const logHabit = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LogHabitPayload }) => 
      habitsApi.logHabit(id, payload),
    onSuccess: () => {
      invalidateHabits();
    },
  });

  return {
    createHabit,
    updateHabit,
    deleteHabit,
    restoreHabit,
    archiveHabit,
    favoriteHabit,
    logHabit,
  };
};
