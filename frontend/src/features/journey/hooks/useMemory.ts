import { useQuery } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';

export const useMemory = (id: string) => {
  return useQuery({
    queryKey: journeyKeys.detail(id),
    queryFn: () => JourneyAPI.getMemory(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};
