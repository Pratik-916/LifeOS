from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, UserSettings

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('bio', 'timezone', 'country', 'language', 'birth_date', 'website')

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = (
            'theme', 'accent_color', 'default_reminder_time', 
            'week_start', 'font_size', 'privacy_mode', 
            'dashboard_widget_preferences', 'notification_preferences'
        )

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    settings = UserSettingsSerializer()

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'avatar', 'is_verified', 'profile', 'settings')
        read_only_fields = ('id', 'email', 'is_verified')

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        settings_data = validated_data.pop('settings', None)

        # Update basic user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update profile
        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        # Update settings
        if settings_data:
            settings = instance.settings
            for attr, value in settings_data.items():
                setattr(settings, attr, value)
            settings.save()

        return instance
