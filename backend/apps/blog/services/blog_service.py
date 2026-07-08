from django.utils import timezone
from rest_framework.exceptions import ValidationError
from apps.blog.models import BlogPost, BlogStatus
from apps.blog.services.blog_content_service import BlogContentService

class BlogService:
    @staticmethod
    def create_post(user, data):
        # Generate slug if not provided
        slug = data.get('slug')
        if not slug and data.get('title'):
            existing = set(BlogPost.objects.values_list('slug', flat=True))
            slug = BlogContentService.generate_slug(data.get('title'), existing)
            data['slug'] = slug

        # Calculate metrics
        content = data.get('content', '')
        word_count = BlogContentService.calculate_word_count(content)
        data['word_count'] = word_count
        data['reading_time'] = BlogContentService.calculate_reading_time(word_count)
        
        if not data.get('excerpt'):
            data['excerpt'] = BlogContentService.generate_excerpt(content)

        seo_errors = BlogContentService.validate_seo_lengths(data.get('seo_title', ''), data.get('seo_description', ''))
        if seo_errors:
            raise ValidationError(seo_errors)

        # Validation for published state
        if data.get('status') == BlogStatus.PUBLISHED:
            BlogService._validate_publishable(data)
            data['published_at'] = timezone.now()
            
        tags = data.pop('tags', [])

        post = BlogPost.objects.create(author=user, **data)
        if tags:
            post.tags.set(tags)
            
        return post

    @staticmethod
    def update_post(post, data):
        if post.status == BlogStatus.ARCHIVED and data.get('status') == BlogStatus.PUBLISHED:
            raise ValidationError({'status': 'Cannot publish an archived post directly. Restore it first.'})

        if 'content' in data:
            content = data['content']
            post.word_count = BlogContentService.calculate_word_count(content)
            post.reading_time = BlogContentService.calculate_reading_time(post.word_count)
            if not data.get('excerpt') and not post.excerpt:
                post.excerpt = BlogContentService.generate_excerpt(content)

        seo_title = data.get('seo_title', post.seo_title)
        seo_desc = data.get('seo_description', post.seo_description)
        seo_errors = BlogContentService.validate_seo_lengths(seo_title, seo_desc)
        if seo_errors:
            raise ValidationError(seo_errors)
            
        new_status = data.get('status', post.status)
        if new_status == BlogStatus.PUBLISHED and post.status != BlogStatus.PUBLISHED:
            BlogService._validate_publishable({**post.__dict__, **data})
            if not post.published_at:
                post.published_at = timezone.now()
                
        if new_status == BlogStatus.SCHEDULED:
            if not data.get('published_at') and not post.published_at:
                 raise ValidationError({'published_at': 'Scheduled posts must have a published_at date.'})
            if data.get('published_at', post.published_at) <= timezone.now():
                 raise ValidationError({'published_at': 'Scheduled date must be in the future.'})

        tags = data.pop('tags', None)
        
        for key, value in data.items():
            setattr(post, key, value)
            
        post.save()
        
        if tags is not None:
            post.tags.set(tags)
            
        return post

    @staticmethod
    def _validate_publishable(data):
        if not data.get('title'):
            raise ValidationError({'title': 'Title is required to publish.'})
        if not data.get('content'):
            raise ValidationError({'content': 'Content is required to publish.'})
        if not data.get('slug'):
            raise ValidationError({'slug': 'Slug is required to publish.'})

    @staticmethod
    def soft_delete_post(post):
        post.soft_delete()

    @staticmethod
    def restore_post(post):
        post.restore()

    @staticmethod
    def feature_post(post, featured=True):
        post.featured = featured
        post.save(update_fields=['featured', 'updated_at'])
        return post

    @staticmethod
    def pin_post(post, pinned=True):
        post.pinned = pinned
        post.save(update_fields=['pinned', 'updated_at'])
        return post
