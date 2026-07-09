import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blog';
import { blogKeys } from '../api/blog.keys';
import { mapBlogPostToDomain, mapBlogPostPublicToDomain } from '../api/blog.mapper';

export const useBlogPost = (id: string | null) => {
  return useQuery({
    queryKey: blogKeys.detail(id!),
    queryFn: async () => {
      const data = await blogApi.getPost(id!);
      return mapBlogPostToDomain(data);
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

export const usePublicBlogPost = (slug: string | null) => {
  return useQuery({
    queryKey: blogKeys.slug(slug!),
    queryFn: async () => {
      const data = await blogApi.getPublicPostBySlug(slug!);
      return mapBlogPostPublicToDomain(data);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};
