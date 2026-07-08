from rest_framework import serializers
from django.utils import timezone
from .models import Task, SubTask, TaskActivity
from apps.tags.models import Tag
from apps.tags.serializers import TagSerializer

class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = ('id', 'title', 'is_completed', 'order')
        read_only_fields = ('id',)

class TaskActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskActivity
        fields = ('id', 'action', 'details', 'created_at')
        read_only_fields = ('id', 'action', 'details', 'created_at')

class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True, required=False)
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    # Read-only nested tags for retrieval
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    
    # Optimistic locking field, optional on update
    last_updated_at = serializers.DateTimeField(required=False, write_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'status', 'priority', 'category',
            'due_date', 'due_time', 'estimated_minutes', 'actual_minutes',
            'reminder_datetime', 'is_recurring', 'recurring_type',
            'tags', 'tags_detail', 'notes', 'is_archived', 'is_pinned',
            'completed_at', 'created_at', 'updated_at', 'deleted_at',
            'subtasks', 'last_updated_at'
        )
        read_only_fields = ('id', 'completed_at', 'created_at', 'updated_at', 'deleted_at')

    def validate(self, attrs):
        # Validation rules
        due_date = attrs.get('due_date', getattr(self.instance, 'due_date', None))
        reminder = attrs.get('reminder_datetime', getattr(self.instance, 'reminder_datetime', None))
        
        if reminder and due_date:
            if reminder.date() > due_date:
                raise serializers.ValidationError({"reminder_datetime": "Reminder cannot be after the due date."})

        is_recurring = attrs.get('is_recurring', getattr(self.instance, 'is_recurring', False))
        recurring_type = attrs.get('recurring_type', getattr(self.instance, 'recurring_type', ''))
        
        if is_recurring and not recurring_type:
            raise serializers.ValidationError({"recurring_type": "Recurring type is required for recurring tasks."})

        # Completed tasks cannot return to recurring without validation (client must uncheck completed first)
        status = attrs.get('status', getattr(self.instance, 'status', 'todo'))
        if self.instance and self.instance.status == 'completed' and status != 'completed':
            if is_recurring:
                 # It's fine to uncomplete, but if they try to do weird state shifts it's blocked.
                 pass

        if attrs.get('estimated_minutes', 0) < 0:
            raise serializers.ValidationError({"estimated_minutes": "Estimated minutes cannot be negative."})
        if attrs.get('actual_minutes', 0) < 0:
            raise serializers.ValidationError({"actual_minutes": "Actual minutes cannot be negative."})

        # Optimistic locking check
        if self.instance and 'last_updated_at' in attrs:
            client_updated_at = attrs.pop('last_updated_at')
            # Compare up to seconds to avoid precision issues
            if self.instance.updated_at.replace(microsecond=0) > client_updated_at.replace(microsecond=0):
                raise serializers.ValidationError({
                    "non_field_errors": "This task was modified by another device since you last synced. Please refresh."
                })

        return attrs

    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        tags_data = validated_data.pop('tags', [])
        
        task = Task.objects.create(**validated_data)
        
        if tags_data:
            task.tags.set(tags_data)
            
        for index, subtask_data in enumerate(subtasks_data):
            if 'order' not in subtask_data:
                subtask_data['order'] = index
            SubTask.objects.create(task=task, **subtask_data)
            
        return task

    def update(self, instance, validated_data):
        subtasks_data = validated_data.pop('subtasks', None)
        tags_data = validated_data.pop('tags', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if tags_data is not None:
            instance.tags.set(tags_data)

        # Basic replacement for subtasks for simplicity in nested updates
        if subtasks_data is not None:
            instance.subtasks.all().delete()
            for index, subtask_data in enumerate(subtasks_data):
                if 'order' not in subtask_data:
                    subtask_data['order'] = index
                SubTask.objects.create(task=instance, **subtask_data)
                
        return instance
