from django.shortcuts import get_object_or_404
from apps.journey.models import Memory

class JourneyService:
    @staticmethod
    def create_memory(user, validated_data):
        return Memory.objects.create(user=user, **validated_data)

    @staticmethod
    def update_memory(instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    @staticmethod
    def delete_memory(instance):
        instance.delete()

    @staticmethod
    def restore_memory(instance):
        instance.restore()

    @staticmethod
    def toggle_favorite(instance):
        instance.favorite = not instance.favorite
        instance.save(update_fields=['favorite', 'updated_at', 'version'])
        return instance.favorite

    @staticmethod
    def toggle_pin(instance):
        instance.pinned = not instance.pinned
        instance.save(update_fields=['pinned', 'updated_at', 'version'])
        return instance.pinned
