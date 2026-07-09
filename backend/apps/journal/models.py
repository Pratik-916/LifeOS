import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel, SoftDeleteModel, OptimisticLockModel
from apps.tags.models import Tag

User = get_user_model()

class JournalEntry(SoftDeleteModel, OptimisticLockModel):
    MOOD_CHOICES = (
        ('amazing', 'Amazing'),
        ('good', 'Good'),
        ('neutral', 'Neutral'),
        ('sad', 'Sad'),
        ('anxious', 'Anxious'),
        ('angry', 'Angry'),
        ('exhausted', 'Exhausted'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    )
    
    VISIBILITY_CHOICES = (
        ('private', 'Private'),
        ('shared', 'Shared'),
        ('public', 'Public'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    import_id = models.CharField(max_length=255, null=True, blank=True, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries')
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    summary = models.TextField(blank=True)
    
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, blank=True)
    energy_level = models.PositiveSmallIntegerField(null=True, blank=True) # 1-10
    stress_level = models.PositiveSmallIntegerField(null=True, blank=True) # 1-10
    
    # Reflection Sections
    gratitude = models.TextField(blank=True)
    todays_wins = models.TextField(blank=True)
    challenges = models.TextField(blank=True)
    lessons_learned = models.TextField(blank=True)
    tomorrow_focus = models.TextField(blank=True)
    
    # Metadata
    is_favorite = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='private')
    
    word_count = models.PositiveIntegerField(default=0)
    reading_time = models.PositiveIntegerField(default=0) # in minutes
    
    # AI Metadata
    ai_processed = models.BooleanField(default=False)
    ai_summary = models.TextField(blank=True)
    sentiment_score = models.FloatField(null=True, blank=True) # -1.0 to 1.0
    writing_score = models.FloatField(null=True, blank=True)
    ai_tags = models.JSONField(default=list, blank=True)
    ai_last_processed = models.DateTimeField(null=True, blank=True)
    
    # Relations
    tags = models.ManyToManyField(Tag, blank=True, related_name='journal_entries')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['user', 'is_favorite']),
            models.Index(fields=['user', 'is_pinned']),
        ]

    def clean(self):
        if self.energy_level is not None and not (1 <= self.energy_level <= 10):
            raise ValidationError({'energy_level': 'Energy level must be between 1 and 10.'})
        if self.stress_level is not None and not (1 <= self.stress_level <= 10):
            raise ValidationError({'stress_level': 'Stress level must be between 1 and 10.'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} by {self.user.email}"

class JournalImage(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    journal = models.ForeignKey(JournalEntry, on_delete=models.CASCADE, related_name='images')
    
    image = models.ImageField(upload_to='journal_images/')
    caption = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'created_at']

    def clean(self):
        if not self.pk: # Only check on creation
            MAX_IMAGES = 10
            if JournalImage.objects.filter(journal=self.journal).count() >= MAX_IMAGES:
                raise ValidationError(f"Maximum of {MAX_IMAGES} images allowed per journal entry.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image for {self.journal.title}"
