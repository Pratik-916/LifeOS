from rest_framework import serializers
from .models import JournalEntry, JournalImage
from apps.tags.models import Tag
from apps.tags.serializers import TagSerializer

class JournalImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalImage
        fields = ('id', 'image', 'caption', 'alt_text', 'order', 'created_at')
        read_only_fields = ('id', 'created_at')

class JournalEntrySerializer(serializers.ModelSerializer):
    images = JournalImageSerializer(many=True, required=False)
    
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    
    last_updated_at = serializers.DateTimeField(required=False, write_only=True)

    class Meta:
        model = JournalEntry
        fields = (
            'id', 'title', 'content', 'summary', 'mood', 'energy_level', 'stress_level',
            'gratitude', 'todays_wins', 'challenges', 'lessons_learned', 'tomorrow_focus',
            'is_favorite', 'is_pinned', 'status', 'visibility',
            'word_count', 'reading_time',
            'ai_processed', 'ai_summary', 'sentiment_score', 'writing_score', 'ai_tags', 'ai_last_processed',
            'tags', 'tags_detail', 'images',
            'created_at', 'updated_at', 'deleted_at', 'last_updated_at'
        )
        read_only_fields = (
            'id', 'word_count', 'reading_time', 'ai_processed', 'ai_summary', 
            'sentiment_score', 'writing_score', 'ai_tags', 'ai_last_processed',
            'created_at', 'updated_at', 'deleted_at'
        )

    def validate(self, attrs):
        # Optimistic locking
        if self.instance and 'last_updated_at' in attrs:
            client_updated_at = attrs.pop('last_updated_at')
            if self.instance.updated_at.replace(microsecond=0) > client_updated_at.replace(microsecond=0):
                raise serializers.ValidationError({
                    "non_field_errors": "This entry was modified by another device since you last synced. Please refresh."
                })
        return attrs

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        tags_data = validated_data.pop('tags', [])
        
        entry = JournalEntry.objects.create(**validated_data)
        
        if tags_data:
            entry.tags.set(tags_data)
            
        for index, image_data in enumerate(images_data):
            if 'order' not in image_data:
                image_data['order'] = index
            JournalImage.objects.create(journal=entry, **image_data)
            
        return entry

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        tags_data = validated_data.pop('tags', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if tags_data is not None:
            instance.tags.set(tags_data)

        if images_data is not None:
            # Recreate for simplicity, real app might sync IDs for images
            instance.images.all().delete()
            for index, image_data in enumerate(images_data):
                if 'order' not in image_data:
                    image_data['order'] = index
                JournalImage.objects.create(journal=instance, **image_data)
                
        instance.save()
        return instance
