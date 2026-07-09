import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blog';
import { blogKeys } from '../api/blog.keys';
import { mapBlogPostToDomain, mapBlogPostPublicToDomain } from '../api/blog.mapper';
import type { GetPostsFilters } from '../api/blog.types';

export const useBlogPosts = (filters: GetPostsFilters = {}) => {
  return useQuery({
    queryKey: blogKeys.list({ admin: true, ...filters }),
    queryFn: async () => {
      const data = await blogApi.getPosts(filters);
      return {
        ...data,
        results: data.results.map(mapBlogPostToDomain)
      };
    },
    staleTime: 30 * 1000, // 30 seconds for CMS
  });
};

export const usePublicBlogPosts = (filters: GetPostsFilters = {}) => {
  return useQuery({
    queryKey: blogKeys.list({ public: true, ...filters }),
    queryFn: async () => {
      const data = await blogApi.getPublicPosts(filters);
      return {
        ...data,
        results: data.results.map(mapBlogPostPublicToDomain)
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for public posts
  });
};

export const useFeaturedPosts = () => {
  return useQuery({
    queryKey: blogKeys.featured(),
    queryFn: async () => {
      const data = await blogApi.getFeaturedPosts();
      return data.map(mapBlogPostPublicToDomain);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
