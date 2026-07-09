from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel, SoftDeleteModel, OptimisticLockModel
from apps.tags.models import Tag

class BlogStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    REVIEW = 'review', 'Review'
    SCHEDULED = 'scheduled', 'Scheduled'
    PUBLISHED = 'published', 'Published'
    ARCHIVED = 'archived', 'Archived'

class BlogVisibility(models.TextChoices):
    PRIVATE = 'private', 'Private'
    UNLISTED = 'unlisted', 'Unlisted'
    PUBLIC = 'public', 'Public'

class BlogCategory(TimeStampedModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, blank=True)
    icon = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name

class BlogPost(SoftDeleteModel, OptimisticLockModel):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_posts')
    import_id = models.CharField(max_length=255, null=True, blank=True, unique=True, db_index=True)
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags = models.ManyToManyField(Tag, blank=True, related_name='blog_posts')

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField(blank=True)
    
    featured_image = models.ImageField(upload_to='blog/featured/', null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=BlogStatus.choices, default=BlogStatus.DRAFT)
    visibility = models.CharField(max_length=20, choices=BlogVisibility.choices, default=BlogVisibility.PRIVATE)
    
    featured = models.BooleanField(default=False)
    pinned = models.BooleanField(default=False)
    
    allow_comments = models.BooleanField(default=False)
    
    published_at = models.DateTimeField(null=True, blank=True)
    
    reading_time = models.IntegerField(default=0, help_text="Estimated reading time in minutes")
    word_count = models.IntegerField(default=0)
    
    # SEO
    seo_title = models.CharField(max_length=100, blank=True)
    seo_description = models.CharField(max_length=200, blank=True)
    
    # Future SEO
    og_title = models.CharField(max_length=100, blank=True)
    og_description = models.CharField(max_length=200, blank=True)
    og_image = models.ImageField(upload_to='blog/og/', null=True, blank=True)
    
    twitter_title = models.CharField(max_length=100, blank=True)
    twitter_description = models.CharField(max_length=200, blank=True)
    
    canonical_url = models.URLField(max_length=500, blank=True)
    
    # AI
    ai_generated = models.BooleanField(default=False)
    ai_summary = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class BlogImage(TimeStampedModel):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='blog/content/')
    alt_text = models.CharField(max_length=200, blank=True)
    caption = models.CharField(max_length=300, blank=True)
    display_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['display_order']


class BlogComment(SoftDeleteModel):
    """
    Future-ready comment model, disabled by default.
    """
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_comments')
    content = models.TextField()
    is_approved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
