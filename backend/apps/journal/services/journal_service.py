from django.shortcuts import get_object_or_404
from apps.journal.models import JournalEntry

class JournalService:
    @staticmethod
    def create_journal(user, validated_data):
        return JournalEntry.objects.create(user=user, **validated_data)

    @staticmethod
    def update_journal(instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    @staticmethod
    def delete_journal(instance):
        instance.delete()

    @staticmethod
    def restore_journal(instance):
        instance.restore()

    @staticmethod
    def toggle_favorite(instance):
        instance.is_favorite = not instance.is_favorite
        instance.save(update_fields=['is_favorite', 'updated_at', 'version'])
        return instance.is_favorite

    @staticmethod
    def toggle_pin(instance):
        instance.is_pinned = not instance.is_pinned
        instance.save(update_fields=['is_pinned', 'updated_at', 'version'])
        return instance.is_pinned
