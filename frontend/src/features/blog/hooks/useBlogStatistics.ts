import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blog';
import { blogKeys } from '../api/blog.keys';
import { mapBlogStatisticsToDomain } from '../api/blog.mapper';

export const useBlogStatistics = () => {
  return useQuery({
    queryKey: blogKeys.statistics(),
    queryFn: async () => {
      const data = await blogApi.getBlogStatistics();
      return mapBlogStatisticsToDomain(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
