from rest_framework import serializers
from .models import Goal, Milestone
from apps.tags.models import Tag
from apps.tags.serializers import TagSerializer

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ('id', 'title', 'description', 'due_date', 'is_completed', 'completed_at', 'order', 'notes', 'estimated_hours', 'actual_hours', 'priority')
        read_only_fields = ('id', 'completed_at')

class GoalSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, required=False)
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    
    last_updated_at = serializers.DateTimeField(required=False, write_only=True)

    class Meta:
        model = Goal
        fields = (
            'id', 'title', 'description', 'category', 'priority', 'status',
            'target_date', 'start_date', 'completed_at', 'progress',
            'estimated_hours', 'actual_hours', 'color', 'icon',
            'is_favorite', 'is_archived', 'tags', 'tags_detail', 'milestones',
            'created_at', 'updated_at', 'deleted_at', 'last_updated_at'
        )
        read_only_fields = ('id', 'status', 'completed_at', 'created_at', 'updated_at', 'deleted_at')

    def validate(self, attrs):
        start_date = attrs.get('start_date', getattr(self.instance, 'start_date', None))
        target_date = attrs.get('target_date', getattr(self.instance, 'target_date', None))
        
        if start_date and target_date:
            if start_date > target_date:
                raise serializers.ValidationError({"target_date": "Target date cannot be before start date."})

        if attrs.get('estimated_hours', 0) < 0:
            raise serializers.ValidationError({"estimated_hours": "Estimated hours cannot be negative."})
        if attrs.get('actual_hours', 0) < 0:
            raise serializers.ValidationError({"actual_hours": "Actual hours cannot be negative."})

        # Optimistic locking
        if self.instance and 'last_updated_at' in attrs:
            client_updated_at = attrs.pop('last_updated_at')
            if self.instance.updated_at.replace(microsecond=0) > client_updated_at.replace(microsecond=0):
                raise serializers.ValidationError({
                    "non_field_errors": "This goal was modified by another device since you last synced. Please refresh."
                })

        return attrs

    def create(self, validated_data):
        milestones_data = validated_data.pop('milestones', [])
        tags_data = validated_data.pop('tags', [])
        
        goal = Goal.objects.create(**validated_data)
        
        if tags_data:
            goal.tags.set(tags_data)
            
        for index, ms_data in enumerate(milestones_data):
            if 'order' not in ms_data:
                ms_data['order'] = index
            Milestone.objects.create(goal=goal, **ms_data)
            
        # trigger save to calculate progress if needed
        goal.save()
        return goal

    def update(self, instance, validated_data):
        milestones_data = validated_data.pop('milestones', None)
        tags_data = validated_data.pop('tags', None)

        # Update goal attributes
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if tags_data is not None:
            instance.tags.set(tags_data)

        if milestones_data is not None:
            # We recreate them for simplicity in this REST implementation, 
            # though in a true patch we might match IDs.
            instance.milestones.all().delete()
            for index, ms_data in enumerate(milestones_data):
                if 'order' not in ms_data:
                    ms_data['order'] = index
                Milestone.objects.create(goal=instance, **ms_data)
                
        # Final save triggers auto progress and status calculation
        instance.save()
        return instance
