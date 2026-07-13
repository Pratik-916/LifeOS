import { useQuery } from '@tanstack/react-query';
import { journeyApi } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';

export const useJourneyStatistics = () => {
  return useQuery({
    queryKey: journeyKeys.statistics(),
    queryFn: () => journeyApi.getJourneyStatistics(),
  });
};
