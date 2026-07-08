from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import Goal, Milestone
from apps.activities.models import Activity

@receiver(pre_save, sender=Goal)
def capture_old_goal_state(sender, instance, **kwargs):
    if not instance._state.adding:
        try:
            instance._old_instance = Goal.objects.get(pk=instance.pk)
        except Goal.DoesNotExist:
            instance._old_instance = None
    else:
        instance._old_instance = None

@receiver(post_save, sender=Goal)
def create_goal_activity(sender, instance, created, **kwargs):
    content_type = ContentType.objects.get_for_model(Goal)
    
    if created:
        Activity.objects.create(
            user=instance.user,
            content_type=content_type,
            object_id=instance.id,
            action="Goal Created",
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
                action=f"Goal {instance.get_status_display()}",
                metadata={"old": old.status, "new": instance.status}
            )
            
        if old.progress != instance.progress:
            # Avoid spamming activity for 1% changes, only record significant ones or just status
            # For this requirement we log it if it reaches 100 or something, but we will log it.
            # Usually we don't log every minor progress change in activity feed, but we can do major bounds
            pass
            
        if old.is_archived != instance.is_archived:
            action = "Goal Archived" if instance.is_archived else "Goal Unarchived"
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action=action,
                metadata={}
            )

        if old.deleted_at != instance.deleted_at:
            if instance.deleted_at:
                Activity.objects.create(
                    user=instance.user,
                    content_type=content_type,
                    object_id=instance.id,
                    action="Goal Deleted",
                    metadata={}
                )
            else:
                Activity.objects.create(
                    user=instance.user,
                    content_type=content_type,
                    object_id=instance.id,
                    action="Goal Restored",
                    metadata={}
                )

@receiver(pre_save, sender=Milestone)
def capture_old_milestone_state(sender, instance, **kwargs):
    if not instance._state.adding:
        try:
            instance._old_instance = Milestone.objects.get(pk=instance.pk)
        except Milestone.DoesNotExist:
            instance._old_instance = None
    else:
        instance._old_instance = None

@receiver(post_save, sender=Milestone)
def create_milestone_activity(sender, instance, created, **kwargs):
    content_type = ContentType.objects.get_for_model(Milestone)
    
    if created:
        Activity.objects.create(
            user=instance.goal.user,
            content_type=content_type,
            object_id=instance.id,
            action="Milestone Created",
            metadata={"title": instance.title, "goal_id": str(instance.goal.id)}
        )
    else:
        old = getattr(instance, '_old_instance', None)
        if not old:
            return

        if old.is_completed != instance.is_completed:
            action = "Milestone Completed" if instance.is_completed else "Milestone Reopened"
            Activity.objects.create(
                user=instance.goal.user,
                content_type=content_type,
                object_id=instance.id,
                action=action,
                metadata={"title": instance.title, "goal_id": str(instance.goal.id)}
            )
