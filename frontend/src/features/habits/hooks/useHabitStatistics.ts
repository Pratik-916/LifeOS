import { useQuery } from '@tanstack/react-query';
import { HabitsAPI } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';

export const useHabitStatistics = () => {
  return useQuery({
    queryKey: habitsKeys.statistics(),
    queryFn: () => HabitsAPI.getHabitStatistics(),
    staleTime: 10 * 1000, // 10 seconds
  });
};
