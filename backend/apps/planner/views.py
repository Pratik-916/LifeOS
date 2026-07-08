from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum, Q, Avg, F
from django.shortcuts import get_object_or_404
from datetime import timedelta
import pytz

from .models import Task, SubTask
from .serializers import TaskSerializer
from apps.users.permissions import IsOwner

class TaskViewSet(viewsets.ModelViewSet):
    """
    CRUD for Tasks.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filterset_fields = ['status', 'priority', 'category', 'is_recurring', 'is_archived', 'is_pinned']
    search_fields = ['title', 'description', 'notes', 'tags__name']
    ordering_fields = ['due_date', 'priority', 'created_at', 'updated_at']

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Task.objects.none()
        return Task.objects.filter(user=self.request.user).prefetch_related('subtasks', 'tags')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # Soft delete is handled by the model's delete() override
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """
        Restores a soft-deleted task.
        """
        # Need to use all_objects to find soft-deleted items
        task = get_object_or_404(Task.all_objects.filter(user=request.user), pk=pk)
        if task.deleted_at:
            task.restore()
            return Response({'status': 'task restored'})
        return Response({'status': 'task was not deleted'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Comprehensive Statistics endpoint for the Analytics Dashboard.
        Uses the user's local timezone for date-based calculations.
        """
        user = request.user
        qs = self.get_queryset()

        # Handle user timezone
        user_tz_str = getattr(user.profile, 'timezone', 'UTC') if hasattr(user, 'profile') else 'UTC'
        try:
            user_tz = pytz.timezone(user_tz_str)
        except pytz.UnknownTimeZoneError:
            user_tz = pytz.UTC

        now = timezone.now()
        local_now = now.astimezone(user_tz)
        today = local_now.date()
        week_end = today + timedelta(days=7)

        # Aggregate metrics
        metrics = qs.aggregate(
            total_tasks=Count('id'),
            completed=Count('id', filter=Q(status='completed')),
            pending=Count('id', filter=~Q(status='completed')),
            overdue=Count('id', filter=Q(due_date__lt=today, status__in=['todo', 'in_progress'])),
            due_today=Count('id', filter=Q(due_date=today, status__in=['todo', 'in_progress'])),
            due_this_week=Count('id', filter=Q(due_date__gte=today, due_date__lte=week_end, status__in=['todo', 'in_progress'])),
            archived=Count('id', filter=Q(is_archived=True)),
            pinned=Count('id', filter=Q(is_pinned=True)),
            estimated_hours=Sum('estimated_minutes') / 60.0,
            actual_hours=Sum('actual_minutes') / 60.0,
            high_priority=Count('id', filter=Q(priority='high', status__in=['todo', 'in_progress']))
        )

        total = metrics['total_tasks'] or 0
        completed = metrics['completed'] or 0
        metrics['completion_rate'] = round((completed / total * 100), 2) if total > 0 else 0

        # Handle None for Sums
        metrics['estimated_hours'] = round(metrics['estimated_hours'] or 0, 2)
        metrics['actual_hours'] = round(metrics['actual_hours'] or 0, 2)

        # Average completion time (days)
        completed_tasks = qs.filter(status='completed', completed_at__isnull=False)
        avg_completion = completed_tasks.annotate(
            duration=F('completed_at') - F('created_at')
        ).aggregate(avg_duration=Avg('duration'))['avg_duration']
        
        metrics['average_completion_days'] = avg_completion.days if avg_completion else 0

        # Simple trends - could be expanded based on history/activity tracking
        metrics['productivity_score'] = metrics['completion_rate'] * 0.8 + (100 if metrics['overdue'] == 0 else 0) * 0.2

        return Response(metrics)
