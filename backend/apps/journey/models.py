import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel, SoftDeleteModel, OptimisticLockModel
from apps.tags.models import Tag

User = get_user_model()

class Memory(SoftDeleteModel, OptimisticLockModel):
    CATEGORY_CHOICES = (
        ('achievement', 'Achievement'),
        ('career', 'Career'),
        ('education', 'Education'),
        ('health', 'Health'),
        ('fitness', 'Fitness'),
        ('travel', 'Travel'),
        ('relationship', 'Relationship'),
        ('finance', 'Finance'),
        ('project', 'Project'),
        ('personal', 'Personal'),
        ('milestone', 'Milestone'),
        ('celebration', 'Celebration'),
        ('other', 'Other'),
    )
    
    VISIBILITY_CHOICES = (
        ('private', 'Private'),
        ('shared', 'Shared'),
        ('public', 'Public'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    import_id = models.CharField(max_length=255, null=True, blank=True, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memories')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='private')
    
    favorite = models.BooleanField(default=False)
    pinned = models.BooleanField(default=False)
    color = models.CharField(max_length=20, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    # Relations
    tags = models.ManyToManyField(Tag, blank=True, related_name='memories')

    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['user', 'category']),
            models.Index(fields=['user', 'favorite']),
            models.Index(fields=['user', 'pinned']),
        ]

    def __str__(self):
        return f"{self.title} by {self.user.email}"

class MemoryImage(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    memory = models.ForeignKey(Memory, on_delete=models.CASCADE, related_name='images')
    
    image = models.ImageField(upload_to='memory_images/')
    caption = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    # uploaded_at is effectively created_at from TimeStampedModel

    class Meta:
        ordering = ['display_order', 'created_at']

    def clean(self):
        if not self.pk: # Only check on creation
            MAX_IMAGES = 10
            if MemoryImage.objects.filter(memory=self.memory).count() >= MAX_IMAGES:
                raise ValidationError(f"Maximum of {MAX_IMAGES} images allowed per memory.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image for {self.memory.title}"
