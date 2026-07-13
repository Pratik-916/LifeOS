import { useQuery } from '@tanstack/react-query';
import { habitsApi } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';
import type { HabitFilters } from '../api/habits.types';

export const useHabits = (filters?: HabitFilters) => {
  return useQuery({
    queryKey: habitsKeys.list(filters || {}),
    queryFn: () => habitsApi.getHabits(filters),
    placeholderData: (previousData) => previousData,
  });
};
