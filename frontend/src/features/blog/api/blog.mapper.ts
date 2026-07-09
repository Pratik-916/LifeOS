import type { 
  BlogCategoryDTO, BlogCategoryModel,
  TagDTO, TagModel,
  BlogImageDTO, BlogImageModel,
  BlogPostDTO, BlogPostModel,
  BlogPostPublicDTO, BlogPostPublicModel,
  BlogStatisticsDTO, BlogStatisticsModel
} from './blog.types';

export const mapBlogCategoryToDomain = (dto: BlogCategoryDTO): BlogCategoryModel => ({
  id: dto.id,
  name: dto.name,
  slug: dto.slug,
  description: dto.description,
  color: dto.color,
  icon: dto.icon,
});

export const mapTagToDomain = (dto: TagDTO): TagModel => ({
  id: dto.id,
  name: dto.name,
  slug: dto.slug,
  color: dto.color,
});

export const mapBlogImageToDomain = (dto: BlogImageDTO): BlogImageModel => ({
  id: dto.id,
  postId: dto.post,
  imageUrl: dto.image,
  altText: dto.alt_text,
  caption: dto.caption,
  displayOrder: dto.display_order,
});

export const mapBlogPostToDomain = (dto: BlogPostDTO): BlogPostModel => ({
  id: dto.id,
  authorId: dto.author,
  categoryId: dto.category,
  category: dto.category_detail ? mapBlogCategoryToDomain(dto.category_detail) : null,
  tagIds: dto.tags || [],
  tags: dto.tags_detail ? dto.tags_detail.map(mapTagToDomain) : [],
  images: dto.images ? dto.images.map(mapBlogImageToDomain) : [],
  
  title: dto.title,
  slug: dto.slug,
  excerpt: dto.excerpt,
  content: dto.content,
  featuredImage: dto.featured_image,
  
  status: dto.status,
  visibility: dto.visibility,
  featured: dto.featured,
  pinned: dto.pinned,
  
  allowComments: dto.allow_comments,
  
  publishedAt: dto.published_at,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  
  readingTime: dto.reading_time,
  wordCount: dto.word_count,
  
  seoTitle: dto.seo_title,
  seoDescription: dto.seo_description,
  canonicalUrl: dto.canonical_url,
  ogTitle: dto.og_title,
  ogDescription: dto.og_description,
  ogImage: dto.og_image,
  twitterTitle: dto.twitter_title,
  twitterDescription: dto.twitter_description,
  
  aiGenerated: dto.ai_generated,
  aiSummary: dto.ai_summary,
});

export const mapBlogPostPublicToDomain = (dto: BlogPostPublicDTO): BlogPostPublicModel => ({
  id: dto.id,
  authorName: dto.author_name,
  category: dto.category ? mapBlogCategoryToDomain(dto.category) : null,
  tags: dto.tags ? dto.tags.map(mapTagToDomain) : [],
  
  title: dto.title,
  slug: dto.slug,
  excerpt: dto.excerpt,
  content: dto.content,
  featuredImage: dto.featured_image,
  
  publishedAt: dto.published_at,
  readingTime: dto.reading_time,
  wordCount: dto.word_count,
  
  seoTitle: dto.seo_title,
  seoDescription: dto.seo_description,
  canonicalUrl: dto.canonical_url,
  
  aiGenerated: dto.ai_generated,
  aiSummary: dto.ai_summary,
  
  featured: dto.featured,
  pinned: dto.pinned,
});

export const mapBlogStatisticsToDomain = (dto: BlogStatisticsDTO): BlogStatisticsModel => ({
  totalPosts: dto.total_posts,
  publishedPosts: dto.published_posts,
  draftPosts: dto.draft_posts,
  archivedPosts: dto.archived_posts,
  scheduledPosts: dto.scheduled_posts,
  featuredPosts: dto.featured_posts,
  
  averageReadingTimeMins: dto.average_reading_time_mins,
  averageWordCount: dto.average_word_count,
  
  publishingFrequencyDays: dto.publishing_frequency_days,
  publishingStreak: dto.publishing_streak,
  
  mostUsedTags: dto.most_used_tags,
  mostPopularCategory: dto.most_popular_category,
  
  monthlyPublishing: dto.monthly_publishing,
  yearlyPublishing: dto.yearly_publishing,
  
  topCategories: dto.top_categories,
  topTags: dto.top_tags,
});
