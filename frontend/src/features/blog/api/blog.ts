import { axiosInstance } from '../../../api/axios';
import type { 
  BlogPostDTO, BlogPostPublicDTO, BlogCategoryDTO, BlogStatisticsDTO,
  CreateBlogPostPayload, UpdateBlogPostPayload, GetPostsFilters
} from './blog.types';

export const blogApi = {
  // ---------------------------------------------------------------------------
  // Administrative API (CMS)
  // ---------------------------------------------------------------------------
  getPosts: async (filters: GetPostsFilters = {}) => {
    const response = await axiosInstance.get<{results: BlogPostDTO[], count: number, next: string | null}>('/blog/posts/', { params: filters });
    return response.data;
  },

  getPost: async (id: string) => {
    const response = await axiosInstance.get<BlogPostDTO>(`/blog/posts/${id}/`);
    return response.data;
  },

  createPost: async (payload: CreateBlogPostPayload) => {
    const response = await axiosInstance.post<BlogPostDTO>('/blog/posts/', payload);
    return response.data;
  },

  updatePost: async (id: string, payload: UpdateBlogPostPayload) => {
    const response = await axiosInstance.patch<BlogPostDTO>(`/blog/posts/${id}/`, payload);
    return response.data;
  },

  deletePost: async (id: string) => {
    await axiosInstance.delete(`/blog/posts/${id}/`);
  },

  restorePost: async (id: string) => {
    await axiosInstance.post(`/blog/posts/${id}/restore/`);
  },

  publishPost: async (id: string) => {
    await axiosInstance.post(`/blog/posts/${id}/publish/`);
  },

  schedulePost: async (id: string, published_at: string) => {
    await axiosInstance.post(`/posts/${id}/schedule/`, { published_at });
  },

  featurePost: async (id: string, featured: boolean = true) => {
    await axiosInstance.post(`/posts/${id}/feature/`, { featured });
  },

  // ---------------------------------------------------------------------------
  // Public Blog API
  // ---------------------------------------------------------------------------
  getPublicPosts: async (filters: GetPostsFilters = {}) => {
    const response = await axiosInstance.get<{results: BlogPostPublicDTO[], count: number, next: string | null}>('/blog/', { params: filters });
    return response.data;
  },

  getPublicPostBySlug: async (slug: string) => {
    const response = await axiosInstance.get<BlogPostPublicDTO>(`/blog/${slug}/`);
    return response.data;
  },

  getLatestPosts: async () => {
    const response = await axiosInstance.get<BlogPostPublicDTO[]>('/blog/latest/');
    return response.data;
  },

  getFeaturedPosts: async () => {
    const response = await axiosInstance.get<BlogPostPublicDTO[]>('/blog/featured/');
    return response.data;
  },

  searchPosts: async (query: string, category?: string, tag?: string) => {
    const params: any = { q: query };
    if (category) params.category = category;
    if (tag) params.tag = tag;
    const response = await axiosInstance.get<{results: BlogPostPublicDTO[], count: number, next: string | null}>('/blog/search/', { params });
    return response.data;
  },

  getRelatedPosts: async (slug: string) => {
    const response = await axiosInstance.get<BlogPostPublicDTO[]>(`/blog/${slug}/related/`);
    return response.data;
  },

  getBlogStatistics: async () => {
    const response = await axiosInstance.get<BlogStatisticsDTO>('/blog/stats/');
    return response.data;
  },

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------
  getCategories: async () => {
    const response = await axiosInstance.get<BlogCategoryDTO[]>('/categories/');
    // Handle pagination if categories API is paginated
    if (response.data && typeof (response.data as any).results !== 'undefined') {
      return (response.data as any).results as BlogCategoryDTO[];
    }
    return response.data;
  },
};
