import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blog';
import { blogKeys } from '../api/blog.keys';
import { mapBlogPostPublicToDomain } from '../api/blog.mapper';

export const useSearchPosts = (query: string, category?: string, tag?: string) => {
  return useQuery({
    queryKey: blogKeys.search({ query, category, tag }),
    queryFn: async () => {
      const data = await blogApi.searchPosts(query, category, tag);
      return {
        ...data,
        results: data.results.map(mapBlogPostPublicToDomain)
      };
    },
    enabled: !!query, // only run if query is not empty
    staleTime: 5 * 60 * 1000,
  });
};
