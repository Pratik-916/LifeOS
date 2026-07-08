from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Task, TaskActivity

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
    if created:
        TaskActivity.objects.create(
            task=instance,
            action="Task Created",
            details={"title": instance.title}
        )
    else:
        old = getattr(instance, '_old_instance', None)
        if not old:
            return

        # Check for specific changes
        if old.status != instance.status:
            TaskActivity.objects.create(
                task=instance,
                action=f"Status changed to {instance.get_status_display()}",
                details={"old": old.status, "new": instance.status}
            )
            
        if old.priority != instance.priority:
            TaskActivity.objects.create(
                task=instance,
                action=f"Priority changed to {instance.get_priority_display()}",
                details={"old": old.priority, "new": instance.priority}
            )
            
        if old.due_date != instance.due_date:
            TaskActivity.objects.create(
                task=instance,
                action="Due Date updated",
                details={"old": str(old.due_date) if old.due_date else None, "new": str(instance.due_date) if instance.due_date else None}
            )

        if old.deleted_at != instance.deleted_at:
            if instance.deleted_at:
                TaskActivity.objects.create(
                    task=instance,
                    action="Task Deleted",
                    details={}
                )
            else:
                TaskActivity.objects.create(
                    task=instance,
                    action="Task Restored",
                    details={}
                )
