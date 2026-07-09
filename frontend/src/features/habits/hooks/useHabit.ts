import { useQuery } from '@tanstack/react-query';
import { HabitsAPI } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';

export const useHabit = (id: string) => {
  return useQuery({
    queryKey: habitsKeys.detail(id),
    queryFn: () => HabitsAPI.getHabit(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};
