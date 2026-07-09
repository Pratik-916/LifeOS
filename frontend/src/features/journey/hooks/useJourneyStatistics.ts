import { useQuery } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';

export const useJourneyStatistics = () => {
  return useQuery({
    queryKey: journeyKeys.statistics(),
    queryFn: () => JourneyAPI.getJourneyStatistics(),
    staleTime: 10 * 1000,
  });
};
