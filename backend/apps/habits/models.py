import uuid
from django.db import models
from django.contrib.auth import get_user_model
from apps.core.models import TimeStampedModel, SoftDeleteModel, OptimisticLockModel
from apps.tags.models import Tag
from django.core.exceptions import ValidationError

User = get_user_model()

class Habit(SoftDeleteModel, OptimisticLockModel):
    FREQUENCY_CHOICES = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    )

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('archived', 'Archived'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, blank=True)
    
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='daily')
    target_count = models.PositiveIntegerField(default=1)
    current_count = models.PositiveIntegerField(default=0)  # Count for the current period
    
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    completion_rate = models.FloatField(default=0.0)
    
    reminder_time = models.TimeField(null=True, blank=True)
    reminder_enabled = models.BooleanField(default=False)
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    is_favorite = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    
    tags = models.ManyToManyField(Tag, blank=True, related_name='habits')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'frequency']),
            models.Index(fields=['user', 'is_favorite']),
            models.Index(fields=['user', 'is_archived']),
        ]

    def clean(self):
        if self.target_count < 1:
            raise ValidationError({'target_count': 'Target count must be at least 1.'})
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError({'end_date': 'End date cannot be before start date.'})

    def save(self, *args, **kwargs):
        self.clean()
        if self.is_archived and self.status != 'archived':
            self.status = 'archived'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.frequency})"

class HabitLog(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    
    completion_date = models.DateField()
    count = models.PositiveIntegerField(default=1)
    
    notes = models.TextField(blank=True)
    mood = models.CharField(max_length=50, blank=True)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-completion_date', '-created_at']
        unique_together = ('habit', 'completion_date')
        indexes = [
            models.Index(fields=['habit', 'completion_date']),
        ]

    def clean(self):
        if self.habit.status in ['paused', 'archived']:
            raise ValidationError(f"Cannot log progress for a {self.habit.status} habit.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.habit.title} on {self.completion_date}"

class HabitReminder(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='reminders')
    
    reminder_time = models.TimeField()
    # Stored as a list of integers: 0=Mon, 1=Tue, ..., 6=Sun
    days_of_week = models.JSONField(default=list)
    is_enabled = models.BooleanField(default=True)

    def __str__(self):
        return f"Reminder for {self.habit.title} at {self.reminder_time}"
