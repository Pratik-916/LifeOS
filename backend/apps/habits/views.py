from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
import pytz

from .models import Habit, HabitLog
from .serializers import HabitSerializer, HabitLogSerializer
from apps.users.permissions import IsOwner
from .services.statistics_service import get_dashboard_stats

class HabitViewSet(viewsets.ModelViewSet):
    """
    CRUD for Habits.
    """
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filterset_fields = ['status', 'priority', 'category', 'frequency', 'is_favorite', 'is_archived']
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['created_at', 'updated_at', 'priority', 'current_streak', 'completion_rate']

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Habit.objects.none()
        return Habit.objects.filter(user=self.request.user).prefetch_related('logs', 'tags', 'reminders')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        habit = get_object_or_404(Habit.all_objects.filter(user=request.user), pk=pk)
        if habit.deleted_at:
            habit.restore()
            return Response({'status': 'habit restored'})
        return Response({'status': 'habit was not deleted'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def log(self, request, pk=None):
        """
        Quick endpoint to log progress for a habit for a specific date (defaults to today).
        """
        habit = self.get_object()
        
        user_tz_str = getattr(request.user.profile, 'timezone', 'UTC') if hasattr(request.user, 'profile') else 'UTC'
        try:
            user_tz = pytz.timezone(user_tz_str)
        except pytz.UnknownTimeZoneError:
            user_tz = pytz.UTC
            
        default_date = timezone.now().astimezone(user_tz).date()
        
        completion_date_str = request.data.get('completion_date')
        if completion_date_str:
            from datetime import datetime
            completion_date = datetime.strptime(completion_date_str, '%Y-%m-%d').date()
        else:
            completion_date = default_date

        count = int(request.data.get('count', 1))
        notes = request.data.get('notes', '')
        mood = request.data.get('mood', '')
        duration_minutes = request.data.get('duration_minutes')

        # Create or update log for the date
        log, created = HabitLog.objects.get_or_create(
            habit=habit,
            completion_date=completion_date,
            defaults={
                'count': count,
                'notes': notes,
                'mood': mood,
                'duration_minutes': duration_minutes
            }
        )
        
        if not created:
            log.count += count
            if notes: log.notes = notes
            if mood: log.mood = mood
            if duration_minutes: log.duration_minutes = duration_minutes
            log.save()
            
        return Response(HabitLogSerializer(log).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='bulk-pause')
    def bulk_pause(self, request):
        ids = request.data.get('ids', [])
        habits = self.get_queryset().filter(id__in=ids)
        for habit in habits:
            habit.status = 'paused'
            habit.save()
        return Response({'status': 'habits paused'})

    @action(detail=False, methods=['post'], url_path='bulk-resume')
    def bulk_resume(self, request):
        ids = request.data.get('ids', [])
        habits = self.get_queryset().filter(id__in=ids)
        for habit in habits:
            habit.status = 'active'
            habit.save()
        return Response({'status': 'habits resumed'})

    @action(detail=False, methods=['post'], url_path='bulk-archive')
    def bulk_archive(self, request):
        ids = request.data.get('ids', [])
        habits = self.get_queryset().filter(id__in=ids)
        for habit in habits:
            habit.is_archived = True
            habit.status = 'archived'
            habit.save()
        return Response({'status': 'habits archived'})

    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request):
        ids = request.data.get('ids', [])
        habits = self.get_queryset().filter(id__in=ids)
        for habit in habits:
            habit.delete()
        return Response({'status': 'habits deleted'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = get_dashboard_stats(request.user)
        return Response(stats)
