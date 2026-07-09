export const blogKeys = {
  all: ['blog'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
  slugs: () => [...blogKeys.all, 'slug'] as const,
  slug: (slug: string) => [...blogKeys.slugs(), slug] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  featured: () => [...blogKeys.all, 'featured'] as const,
  searches: () => [...blogKeys.all, 'search'] as const,
  search: (query: Record<string, any>) => [...blogKeys.searches(), query] as const,
  statistics: () => [...blogKeys.all, 'statistics'] as const,
};
