from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import Memory
from apps.activities.models import Activity

@receiver(pre_save, sender=Memory)
def capture_old_memory_state(sender, instance, **kwargs):
    if not instance._state.adding:
        try:
            instance._old_instance = Memory.all_objects.get(pk=instance.pk)
        except Memory.DoesNotExist:
            instance._old_instance = None
    else:
        instance._old_instance = None

@receiver(post_save, sender=Memory)
def create_memory_activity(sender, instance, created, **kwargs):
    content_type = ContentType.objects.get_for_model(Memory)
    
    if created:
        Activity.objects.create(
            user=instance.user,
            content_type=content_type,
            object_id=instance.id,
            action="Memory Created",
            metadata={"title": instance.title, "category": instance.category}
        )
    else:
        old = getattr(instance, '_old_instance', None)
        if not old:
            return

        if old.favorite != instance.favorite:
            action = "Memory Favorited" if instance.favorite else "Memory Unfavorited"
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action=action,
                metadata={"title": instance.title}
            )

        if old.pinned != instance.pinned:
            action = "Memory Pinned" if instance.pinned else "Memory Unpinned"
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action=action,
                metadata={"title": instance.title}
            )
            
        if old.deleted_at != instance.deleted_at:
            if instance.deleted_at:
                Activity.objects.create(
                    user=instance.user,
                    content_type=content_type,
                    object_id=instance.id,
                    action="Memory Deleted",
                    metadata={"title": instance.title}
                )
            else:
                Activity.objects.create(
                    user=instance.user,
                    content_type=content_type,
                    object_id=instance.id,
                    action="Memory Restored",
                    metadata={"title": instance.title}
                )
        
        elif old.title != instance.title or old.description != instance.description:
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action="Memory Updated",
                metadata={"title": instance.title}
            )
