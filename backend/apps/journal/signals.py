from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import JournalEntry
from apps.activities.models import Activity
from .services.journal_statistics_service import calculate_word_and_reading_time
from .services.journal_ai_service import generate_summary

@receiver(pre_save, sender=JournalEntry)
def capture_old_journal_state_and_update_metrics(sender, instance, **kwargs):
    # Calculate reading time and word count efficiently
    if instance.content:
        words, reading_time = calculate_word_and_reading_time(instance.content)
        instance.word_count = words
        instance.reading_time = reading_time
    
    # Stub call to AI service
    if not instance.ai_processed:
        summary_res = generate_summary(instance.content)
        if summary_res.get("summary"):
            instance.ai_summary = summary_res["summary"]
            # In a real app we'd set ai_processed = True here on success

    if not instance._state.adding:
        try:
            # We use .only() to fetch only what we need to minimize DB overhead 
            # if we just need old status, favorite, pin, deleted_at, etc.
            # But the requirements mention keeping it simple. We fetch the old instance.
            instance._old_instance = JournalEntry.all_objects.get(pk=instance.pk)
        except JournalEntry.DoesNotExist:
            instance._old_instance = None
    else:
        instance._old_instance = None


@receiver(post_save, sender=JournalEntry)
def create_journal_activity(sender, instance, created, **kwargs):
    content_type = ContentType.objects.get_for_model(JournalEntry)
    
    if created:
        Activity.objects.create(
            user=instance.user,
            content_type=content_type,
            object_id=instance.id,
            action="Journal Created",
            metadata={"title": instance.title}
        )
        
        # Check writing milestones (Total entries)
        total_entries = JournalEntry.objects.filter(user=instance.user).count()
        if total_entries in [10, 50, 100, 500]:
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action="Writing Milestone",
                metadata={"milestone": f"{total_entries} Entries"}
            )
            
        # Check writing milestones (Total words)
        # Using DB aggregation is okay here as it only happens on creation
        from django.db.models import Sum
        total_words = JournalEntry.objects.filter(user=instance.user).aggregate(total=Sum('word_count'))['total'] or 0
        
        for milestone in [1000, 10000, 50000]:
            # If the current entry pushed us over the milestone
            if total_words >= milestone and (total_words - instance.word_count) < milestone:
                Activity.objects.create(
                    user=instance.user,
                    content_type=content_type,
                    object_id=instance.id,
                    action="Writing Milestone",
                    metadata={"milestone": f"{milestone} Words"}
                )
    else:
        old = getattr(instance, '_old_instance', None)
        if not old:
            return

        if old.is_favorite != instance.is_favorite:
            action = "Favorite Added" if instance.is_favorite else "Favorite Removed"
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action=action,
                metadata={"title": instance.title}
            )

        if old.is_pinned != instance.is_pinned:
            action = "Pinned" if instance.is_pinned else "Unpinned"
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
                    action="Journal Deleted",
                    metadata={}
                )
            else:
                Activity.objects.create(
                    user=instance.user,
                    content_type=content_type,
                    object_id=instance.id,
                    action="Journal Restored",
                    metadata={}
                )
        
        # Determine if content was significantly updated
        elif old.content != instance.content or old.title != instance.title:
            Activity.objects.create(
                user=instance.user,
                content_type=content_type,
                object_id=instance.id,
                action="Journal Updated",
                metadata={"title": instance.title}
            )
