from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import Task
from apps.activities.models import Activity

@receiver(pre_save, sender=Task)
def capture_old_task_state(sender, instance, **kwargs):
    if not instance._state.adding:
        try:
            instance._old_instance = Task.objects.get(pk=instance.pk)
        except Task.DoesNotExist:
            instance._old_instance = None
    else:
        instance._old_instance = None

@receiver(post_save, sender=Task)
def create_task_activity(sender, instance, created, **kwargs):
    content_type = ContentType.objects.get_for_model(Task)
    
    if created:
        Activity.objects.create(
            user=instance.user,
            content_type=content_type,
            object_id=instance.id,
            action="Task Created",
            metadata={"title": instance.title}
        )
    else:
        old = getattr(instance, '_old_instance', None)
        if not old:
            return

        if old.status != instance.status:
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action=f"Status changed to {instance.get_status_display()}",
                metadata={"old": old.status, "new": instance.status}
            )
            
        if old.priority != instance.priority:
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action=f"Priority changed to {instance.get_priority_display()}",
                metadata={"old": old.priority, "new": instance.priority}
            )
            
        if old.due_date != instance.due_date:
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action="Due Date updated",
                metadata={"old": str(old.due_date) if old.due_date else None, "new": str(instance.due_date) if instance.due_date else None}
            )

        if old.deleted_at != instance.deleted_at:
            if instance.deleted_at:
                Activity.objects.create(
                    user=instance.user,
                    content_type=content_type,
                    object_id=instance.id,
                    action="Task Deleted",
                    metadata={}
                )
            else:
                Activity.objects.create(
                    user=instance.user,
                    content_type=content_type,
                    object_id=instance.id,
                    action="Task Restored",
                    metadata={}
                )
