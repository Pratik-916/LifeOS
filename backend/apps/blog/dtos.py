from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from datetime import datetime

@dataclass
class CategoryDTO:
    id: int
    name: str
    slug: str
    description: str
    color: str
    icon: str

@dataclass
class BlogPostDTO:
    id: str
    author_id: str
    author_name: str
    category: Optional[CategoryDTO]
    tags: List[Dict[str, Any]]
    
    title: str
    slug: str
    excerpt: str
    content: str
    featured_image: Optional[str]
    
    status: str
    visibility: str
    featured: bool
    pinned: bool
    
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    reading_time: int
    word_count: int
    
    seo_title: str
    seo_description: str
    canonical_url: str
    
    ai_generated: bool
    ai_summary: str

@dataclass
class BlogStatisticsDTO:
    total_posts: int
    published_posts: int
    draft_posts: int
    archived_posts: int
    scheduled_posts: int
    featured_posts: int
    
    average_reading_time_mins: float
    average_word_count: int
    
    publishing_frequency_days: float
    publishing_streak: int
    
    most_used_tags: List[Dict[str, Any]]
    most_popular_category: Optional[str]
    
    monthly_publishing: Dict[str, Any] # Format ready for charts
    yearly_publishing: Dict[str, Any]
    
    top_categories: Dict[str, Any]
    top_tags: Dict[str, Any]

@dataclass
class SearchResultDTO:
    query: str
    total_results: int
    posts: List[BlogPostDTO]
