import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blog';
import { blogKeys } from '../api/blog.keys';
import { mapBlogCategoryToDomain } from '../api/blog.mapper';

export const useCategories = () => {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: async () => {
      const data = await blogApi.getCategories();
      return data.map(mapBlogCategoryToDomain);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for public cache strategy
  });
};
