import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { HabitsAPI } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';
import type { HabitFilters } from '../api/habits.types';

export const useHabits = (filters: HabitFilters = {}) => {
  return useQuery({
    queryKey: habitsKeys.list(filters),
    queryFn: () => HabitsAPI.getHabits(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
};
