export interface BlogCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

export interface TagDTO {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface BlogImageDTO {
  id: string;
  post: string;
  image: string;
  alt_text: string;
  caption: string;
  display_order: number;
}

export interface BlogPostDTO {
  id: string;
  author: string;
  category: string | null;
  category_detail: BlogCategoryDTO | null;
  tags: string[];
  tags_detail: TagDTO[];
  images: BlogImageDTO[];
  
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
  visibility: 'private' | 'unlisted' | 'public';
  featured: boolean;
  pinned: boolean;
  
  allow_comments: boolean;
  
  published_at: string | null;
  created_at: string;
  updated_at: string;
  
  reading_time: number;
  word_count: number;
  
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string | null;
  twitter_title: string;
  twitter_description: string;
  
  ai_generated: boolean;
  ai_summary: string;
}

export interface BlogPostPublicDTO {
  id: string;
  author_name: string;
  category: BlogCategoryDTO | null;
  tags: TagDTO[];
  
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  
  published_at: string | null;
  reading_time: number;
  word_count: number;
  
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  
  ai_generated: boolean;
  ai_summary: string;
  
  featured: boolean;
  pinned: boolean;
}

export interface BlogStatisticsDTO {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  archived_posts: number;
  scheduled_posts: number;
  featured_posts: number;
  
  average_reading_time_mins: number;
  average_word_count: number;
  
  publishing_frequency_days: number;
  publishing_streak: number;
  
  most_used_tags: Record<string, any>[];
  most_popular_category: string | null;
  
  monthly_publishing: Record<string, any>;
  yearly_publishing: Record<string, any>;
  
  top_categories: Record<string, any>;
  top_tags: Record<string, any>;
}

// -----------------------------------------------------------------------------
// Domain Models
// -----------------------------------------------------------------------------

export interface BlogCategoryModel {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

export interface TagModel {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface BlogImageModel {
  id: string;
  postId: string;
  imageUrl: string;
  altText: string;
  caption: string;
  displayOrder: number;
}

export interface BlogPostModel {
  id: string;
  authorId: string;
  categoryId: string | null;
  category: BlogCategoryModel | null;
  tagIds: string[];
  tags: TagModel[];
  images: BlogImageModel[];
  
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
  visibility: 'private' | 'unlisted' | 'public';
  featured: boolean;
  pinned: boolean;
  
  allowComments: boolean;
  
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  readingTime: number;
  wordCount: number;
  
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
  twitterTitle: string;
  twitterDescription: string;
  
  aiGenerated: boolean;
  aiSummary: string;
}

export interface BlogPostPublicModel {
  id: string;
  authorName: string;
  category: BlogCategoryModel | null;
  tags: TagModel[];
  
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  
  publishedAt: string | null;
  readingTime: number;
  wordCount: number;
  
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  
  aiGenerated: boolean;
  aiSummary: string;
  
  featured: boolean;
  pinned: boolean;
}

export interface BlogStatisticsModel {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  scheduledPosts: number;
  featuredPosts: number;
  
  averageReadingTimeMins: number;
  averageWordCount: number;
  
  publishingFrequencyDays: number;
  publishingStreak: number;
  
  mostUsedTags: Record<string, any>[];
  mostPopularCategory: string | null;
  
  monthlyPublishing: Record<string, any>;
  yearlyPublishing: Record<string, any>;
  
  topCategories: Record<string, any>;
  topTags: Record<string, any>;
}

// -----------------------------------------------------------------------------
// Payload Types
// -----------------------------------------------------------------------------

export interface CreateBlogPostPayload {
  title: string;
  content: string;
  excerpt?: string;
  category?: string | null;
  tags?: string[];
  status?: 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
  visibility?: 'private' | 'unlisted' | 'public';
  featured?: boolean;
  featured_image?: string | null;
}

export interface UpdateBlogPostPayload extends Partial<CreateBlogPostPayload> {
  slug?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  published_at?: string | null;
}

export interface GetPostsFilters {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  category?: string;
  tag?: string;
}
