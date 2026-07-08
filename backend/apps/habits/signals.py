from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import Habit, HabitLog
from apps.activities.models import Activity
from .services.streak_service import calculate_stats

@receiver(pre_save, sender=Habit)
def capture_old_habit_state(sender, instance, **kwargs):
    if not instance._state.adding:
        try:
            instance._old_instance = Habit.objects.get(pk=instance.pk)
        except Habit.DoesNotExist:
            instance._old_instance = None
    else:
        instance._old_instance = None

@receiver(post_save, sender=Habit)
def habit_saved(sender, instance, created, **kwargs):
    content_type = ContentType.objects.get_for_model(Habit)
    if created:
        Activity.objects.create(
            user=instance.user,
            content_type=content_type,
            object_id=instance.id,
            action="Habit Created",
            metadata={"title": instance.title}
        )
    else:
        old = getattr(instance, '_old_instance', None)
        if not old:
            return

        # Status changes
        if old.status != instance.status:
            action = f"Habit {instance.get_status_display()}"
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action=action,
                metadata={"title": instance.title, "old": old.status, "new": instance.status}
            )
            
        # Archived changes
        if old.is_archived != instance.is_archived:
            action = "Habit Archived" if instance.is_archived else "Habit Unarchived"
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action=action,
                metadata={"title": instance.title}
            )

        # Track streak milestones
        if old.current_streak != instance.current_streak and instance.current_streak > old.current_streak:
            if instance.current_streak > 0 and instance.current_streak % 5 == 0:
                Activity.objects.create(
                    user=instance.user,
                    content_type=content_type,
                    object_id=instance.id,
                    action="Streak Increased",
                    metadata={"title": instance.title, "streak": instance.current_streak}
                )
        
        if old.longest_streak != instance.longest_streak and instance.longest_streak > old.longest_streak:
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action="Longest Streak Broken",
                metadata={"title": instance.title, "longest_streak": instance.longest_streak}
            )

@receiver(post_save, sender=HabitLog)
def habit_log_saved(sender, instance, created, **kwargs):
    habit = instance.habit
    if created:
        content_type = ContentType.objects.get_for_model(Habit)
        Activity.objects.create(
            user=habit.user,
            content_type=content_type,
            object_id=habit.id,
            action="Habit Completed",
            metadata={"title": habit.title, "count": instance.count, "date": str(instance.completion_date)}
        )
    calculate_stats(habit)

@receiver(post_delete, sender=HabitLog)
def habit_log_deleted(sender, instance, **kwargs):
    calculate_stats(instance.habit)
