from rest_framework import serializers
from .models import Memory, MemoryImage
from apps.tags.models import Tag
from apps.tags.serializers import TagSerializer

class MemoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemoryImage
        fields = ('id', 'image', 'caption', 'alt_text', 'display_order', 'created_at')
        read_only_fields = ('id', 'created_at')

class MemorySerializer(serializers.ModelSerializer):
    images = MemoryImageSerializer(many=True, required=False)
    
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    
    last_updated_at = serializers.DateTimeField(required=False, write_only=True)

    class Meta:
        model = Memory
        fields = (
            'id', 'title', 'description', 'date', 'location', 'category', 'visibility',
            'favorite', 'pinned', 'color', 'icon',
            'tags', 'tags_detail', 'images',
            'created_at', 'updated_at', 'deleted_at', 'last_updated_at'
        )
        read_only_fields = (
            'id', 'created_at', 'updated_at', 'deleted_at'
        )

    def validate(self, attrs):
        if self.instance and 'last_updated_at' in attrs:
            client_updated_at = attrs.pop('last_updated_at')
            if self.instance.updated_at.replace(microsecond=0) > client_updated_at.replace(microsecond=0):
                raise serializers.ValidationError({
                    "non_field_errors": "This memory was modified by another device since you last synced. Please refresh."
                })
        return attrs

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        tags_data = validated_data.pop('tags', [])
        
        memory = Memory.objects.create(**validated_data)
        
        if tags_data:
            memory.tags.set(tags_data)
            
        for index, image_data in enumerate(images_data):
            if 'display_order' not in image_data:
                image_data['display_order'] = index
            MemoryImage.objects.create(memory=memory, **image_data)
            
        return memory

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        tags_data = validated_data.pop('tags', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if tags_data is not None:
            instance.tags.set(tags_data)

        if images_data is not None:
            instance.images.all().delete()
            for index, image_data in enumerate(images_data):
                if 'display_order' not in image_data:
                    image_data['display_order'] = index
                MemoryImage.objects.create(memory=instance, **image_data)
                
        instance.save()
        return instance
