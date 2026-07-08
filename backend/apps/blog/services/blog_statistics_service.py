from django.db.models import Count, Avg
from django.db.models.functions import TruncMonth, TruncYear
from apps.blog.models import BlogPost, BlogStatus
from apps.blog.dtos import BlogStatisticsDTO

class BlogStatisticsService:
    @staticmethod
    def get_statistics():
        qs = BlogPost.objects.all()
        
        total = qs.count()
        published = qs.filter(status=BlogStatus.PUBLISHED).count()
        drafts = qs.filter(status=BlogStatus.DRAFT).count()
        archived = qs.filter(status=BlogStatus.ARCHIVED).count()
        scheduled = qs.filter(status=BlogStatus.SCHEDULED).count()
        featured = qs.filter(featured=True).count()
        
        avg_reading = qs.filter(status=BlogStatus.PUBLISHED).aggregate(Avg('reading_time'))['reading_time__avg'] or 0
        avg_words = qs.filter(status=BlogStatus.PUBLISHED).aggregate(Avg('word_count'))['word_count__avg'] or 0
        
        monthly = qs.filter(status=BlogStatus.PUBLISHED).annotate(month=TruncMonth('published_at')).values('month').annotate(count=Count('id')).order_by('-month')[:12]
        yearly = qs.filter(status=BlogStatus.PUBLISHED).annotate(year=TruncYear('published_at')).values('year').annotate(count=Count('id')).order_by('-year')[:5]
        
        top_cats = qs.filter(category__isnull=False, status=BlogStatus.PUBLISHED).values('category__name').annotate(count=Count('id')).order_by('-count')[:5]
        top_tags = qs.filter(tags__isnull=False, status=BlogStatus.PUBLISHED).values('tags__name').annotate(count=Count('id')).order_by('-count')[:10]
        
        return BlogStatisticsDTO(
            total_posts=total,
            published_posts=published,
            draft_posts=drafts,
            archived_posts=archived,
            scheduled_posts=scheduled,
            featured_posts=featured,
            average_reading_time_mins=round(avg_reading, 2),
            average_word_count=int(avg_words),
            publishing_frequency_days=0.0, # Complex calculation, stubbed for now
            publishing_streak=0,
            most_used_tags=[{'name': t['tags__name'], 'count': t['count']} for t in top_tags],
            most_popular_category=top_cats[0]['category__name'] if top_cats else None,
            monthly_publishing={
                'labels': [m['month'].strftime('%b %Y') for m in monthly if m['month']],
                'datasets': [{'label': 'Published', 'data': [m['count'] for m in monthly if m['month']]}]
            },
            yearly_publishing={
                'labels': [y['year'].strftime('%Y') for y in yearly if y['year']],
                'datasets': [{'label': 'Published', 'data': [y['count'] for y in yearly if y['year']]}]
            },
            top_categories={
                'labels': [c['category__name'] for c in top_cats],
                'datasets': [{'label': 'Posts', 'data': [c['count'] for c in top_cats]}]
            },
            top_tags={
                'labels': [t['tags__name'] for t in top_tags],
                'datasets': [{'label': 'Posts', 'data': [t['count'] for t in top_tags]}]
            }
        )
