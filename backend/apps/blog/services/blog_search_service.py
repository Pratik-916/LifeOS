from django.db.models import Q
from apps.blog.models import BlogPost, BlogStatus, BlogVisibility

class BlogSearchService:
    """
    Search Service for Blog.
    Designed so PostgreSQL SearchVector can replace ORM searching later
    without changing ViewSets or APIs.
    """
    @staticmethod
    def search_posts(query: str, filters=None):
        filters = filters or {}
        
        # Base queryset: only public, published posts unless specified otherwise
        qs = BlogPost.objects.filter(
            status=BlogStatus.PUBLISHED, 
            visibility=BlogVisibility.PUBLIC,
            deleted_at__isnull=True
        )
        
        if filters.get('category_slug'):
            qs = qs.filter(category__slug=filters['category_slug'])
            
        if filters.get('tag'):
            qs = qs.filter(tags__name__iexact=filters['tag'])
            
        if query:
            # Current Implementation: ORM icontains
            # Future Implementation: PostgreSQL Full Text Search
            qs = qs.filter(
                Q(title__icontains=query) | 
                Q(excerpt__icontains=query) |
                Q(content__icontains=query)
            )
            
        return qs.distinct().order_by('-published_at', '-created_at')
