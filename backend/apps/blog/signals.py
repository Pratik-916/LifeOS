from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from apps.blog.models import BlogPost, BlogStatus
from apps.activities.models import Activity
from django.contrib.contenttypes.models import ContentType

@receiver(pre_save, sender=BlogPost)
def track_blog_state(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = BlogPost.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
            instance._old_featured = old_instance.featured
            instance._old_pinned = old_instance.pinned
            instance._old_deleted_at = old_instance.deleted_at
        except BlogPost.DoesNotExist:
            pass

@receiver(post_save, sender=BlogPost)
def track_blog_activity(sender, instance, created, **kwargs):
    if not hasattr(instance, 'author') or not instance.author:
        return
        
    action = None
    
    if created:
        action = "Blog Created"
    else:
        old_status = getattr(instance, '_old_status', None)
        old_featured = getattr(instance, '_old_featured', None)
        old_pinned = getattr(instance, '_old_pinned', None)
        old_deleted = getattr(instance, '_old_deleted_at', None)
        
        if old_deleted is None and instance.deleted_at is not None:
            action = "Blog Deleted"
        elif old_deleted is not None and instance.deleted_at is None:
            action = "Blog Restored"
        elif old_status != instance.status:
            if instance.status == BlogStatus.PUBLISHED:
                action = "Blog Published"
            elif instance.status == BlogStatus.ARCHIVED:
                action = "Blog Archived"
            else:
                action = "Blog Updated"
        elif not old_featured and instance.featured:
            action = "Blog Featured"
        elif not old_pinned and instance.pinned:
            action = "Blog Pinned"
        else:
            action = "Blog Updated"

    if action:
        # Avoid creating multiple "Blog Updated" activities rapidly
        Activity.objects.create(
            user=instance.author,
            action=action,
            metadata={"title": instance.title},
            object_id=instance.pk,
            content_type=ContentType.objects.get_for_model(BlogPost)
        )
