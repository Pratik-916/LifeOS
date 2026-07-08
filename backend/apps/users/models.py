import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from apps.core.models import TimeStampedModel

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """
    Custom User model using email as the primary identifier.
    Inherits UUID primary key and timestamps from TimeStampedModel.
    """
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Store token for email verification / password reset
    verification_token = models.CharField(max_length=255, blank=True, null=True)
    reset_password_token = models.CharField(max_length=255, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.email

class UserProfile(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, max_length=500)
    timezone = models.CharField(max_length=50, default='UTC')
    country = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=10, default='en')
    birth_date = models.DateField(null=True, blank=True)
    website = models.URLField(blank=True)

    def __str__(self):
        return f"{self.user.email} Profile"

class UserSettings(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    theme = models.CharField(max_length=20, default='system')  # light, dark, system
    accent_color = models.CharField(max_length=20, default='blue')
    default_reminder_time = models.IntegerField(default=15)  # minutes before event
    week_start = models.IntegerField(default=1)  # 0=Sunday, 1=Monday
    font_size = models.CharField(max_length=20, default='medium')
    privacy_mode = models.BooleanField(default=False)
    
    dashboard_widget_preferences = models.JSONField(default=dict)
    notification_preferences = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.user.email} Settings"
