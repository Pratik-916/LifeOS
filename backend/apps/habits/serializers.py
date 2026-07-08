from rest_framework import serializers
from .models import Habit, HabitLog, HabitReminder
from apps.tags.models import Tag
from apps.tags.serializers import TagSerializer

class HabitReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitReminder
        fields = ('id', 'reminder_time', 'days_of_week', 'is_enabled')
        read_only_fields = ('id',)

class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ('id', 'completion_date', 'count', 'notes', 'mood', 'duration_minutes', 'created_at')
        read_only_fields = ('id', 'created_at')

class HabitSerializer(serializers.ModelSerializer):
    logs = HabitLogSerializer(many=True, read_only=True)
    reminders = HabitReminderSerializer(many=True, required=False)
    
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    
    last_updated_at = serializers.DateTimeField(required=False, write_only=True)

    class Meta:
        model = Habit
        fields = (
            'id', 'title', 'description', 'category', 'icon', 'color',
            'frequency', 'target_count', 'current_count',
            'current_streak', 'longest_streak', 'completion_rate',
            'reminder_time', 'reminder_enabled',
            'start_date', 'end_date', 'status', 'priority',
            'is_favorite', 'is_archived', 'tags', 'tags_detail', 
            'logs', 'reminders',
            'created_at', 'updated_at', 'deleted_at', 'last_updated_at'
        )
        read_only_fields = (
            'id', 'current_count', 'current_streak', 'longest_streak', 
            'completion_rate', 'created_at', 'updated_at', 'deleted_at'
        )

    def validate(self, attrs):
        # Optimistic locking
        if self.instance and 'last_updated_at' in attrs:
            client_updated_at = attrs.pop('last_updated_at')
            if self.instance.updated_at.replace(microsecond=0) > client_updated_at.replace(microsecond=0):
                raise serializers.ValidationError({
                    "non_field_errors": "This habit was modified by another device since you last synced. Please refresh."
                })
        return attrs

    def create(self, validated_data):
        reminders_data = validated_data.pop('reminders', [])
        tags_data = validated_data.pop('tags', [])
        
        habit = Habit.objects.create(**validated_data)
        
        if tags_data:
            habit.tags.set(tags_data)
            
        for reminder_data in reminders_data:
            HabitReminder.objects.create(habit=habit, **reminder_data)
            
        return habit

    def update(self, instance, validated_data):
        reminders_data = validated_data.pop('reminders', None)
        tags_data = validated_data.pop('tags', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if tags_data is not None:
            instance.tags.set(tags_data)

        if reminders_data is not None:
            instance.reminders.all().delete()
            for reminder_data in reminders_data:
                HabitReminder.objects.create(habit=instance, **reminder_data)
                
        instance.save()
        return instance
