import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.core.models import TimeStampedModel, SoftDeleteModel, OptimisticLockModel
from apps.tags.models import Tag

User = get_user_model()

class Goal(SoftDeleteModel, OptimisticLockModel):
    STATUS_CHOICES = (
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    import_id = models.CharField(max_length=255, null=True, blank=True, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    
    target_date = models.DateField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    progress = models.FloatField(default=0.0) # 0 to 100
    estimated_hours = models.FloatField(default=0.0)
    actual_hours = models.FloatField(default=0.0)
    
    color = models.CharField(max_length=20, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    is_favorite = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    
    tags = models.ManyToManyField(Tag, blank=True, related_name='goals')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'target_date']),
            models.Index(fields=['user', 'completed_at']),
            models.Index(fields=['user', 'is_favorite']),
            models.Index(fields=['user', 'is_archived']),
        ]

    def save(self, *args, **kwargs):
        # Prevent NaN and bounds checking
        if self.progress is None or self.progress != self.progress:  # != catches NaN
            self.progress = 0.0
        self.progress = max(0.0, min(100.0, self.progress))

        # Determine status from progress
        if self.progress == 0.0:
            self.status = 'not_started'
        elif self.progress >= 100.0:
            self.status = 'completed'
        else:
            self.status = 'in_progress'

        if self.status == 'completed' and not self.completed_at:
            self.completed_at = timezone.now()
        elif self.status != 'completed' and self.completed_at:
            self.completed_at = None

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.progress}%)"

class Milestone(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='milestones')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    order = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    estimated_hours = models.FloatField(default=0.0)
    actual_hours = models.FloatField(default=0.0)
    priority = models.CharField(max_length=20, choices=Goal.PRIORITY_CHOICES, default='medium')

    class Meta:
        ordering = ['order', 'due_date', 'created_at']

    def save(self, *args, **kwargs):
        if self.is_completed and not self.completed_at:
            self.completed_at = timezone.now()
        elif not self.is_completed and self.completed_at:
            self.completed_at = None
        super().save(*args, **kwargs)
        
        # Trigger goal progress calculation
        self.calculate_goal_progress()

    def delete(self, *args, **kwargs):
        goal = self.goal
        super().delete(*args, **kwargs)
        # Recalculate goal progress after deletion
        self.calculate_goal_progress(goal_instance=goal)

    def calculate_goal_progress(self, goal_instance=None):
        goal = goal_instance or self.goal
        milestones = goal.milestones.all()
        total = milestones.count()
        if total > 0:
            completed = milestones.filter(is_completed=True).count()
            goal.progress = (completed / total) * 100.0
            goal.save()
