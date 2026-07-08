from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum, Q, Avg
from django.shortcuts import get_object_or_404
from datetime import timedelta
import pytz

from .models import Goal
from .serializers import GoalSerializer
from apps.users.permissions import IsOwner

class GoalViewSet(viewsets.ModelViewSet):
    """
    CRUD for Goals.
    """
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filterset_fields = ['status', 'priority', 'category', 'is_favorite', 'is_archived']
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['target_date', 'priority', 'created_at', 'updated_at', 'progress']

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Goal.objects.none()
        return Goal.objects.filter(user=self.request.user).prefetch_related('milestones', 'tags')

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
        Restores a soft-deleted goal.
        """
        goal = get_object_or_404(Goal.all_objects.filter(user=request.user), pk=pk)
        if goal.deleted_at:
            goal.restore()
            return Response({'status': 'goal restored'})
        return Response({'status': 'goal was not deleted'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='bulk-complete')
    def bulk_complete(self, request):
        ids = request.data.get('ids', [])
        goals = self.get_queryset().filter(id__in=ids)
        for goal in goals:
            goal.progress = 100.0
            goal.save() # save triggers status update
        return Response({'status': 'goals completed'})

    @action(detail=False, methods=['post'], url_path='bulk-archive')
    def bulk_archive(self, request):
        ids = request.data.get('ids', [])
        goals = self.get_queryset().filter(id__in=ids)
        for goal in goals:
            goal.is_archived = True
            goal.save()
        return Response({'status': 'goals archived'})

    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request):
        ids = request.data.get('ids', [])
        goals = self.get_queryset().filter(id__in=ids)
        for goal in goals:
            goal.delete()
        return Response({'status': 'goals deleted'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Comprehensive Statistics endpoint for Goals.
        """
        user = request.user
        qs = self.get_queryset()

        user_tz_str = getattr(user.profile, 'timezone', 'UTC') if hasattr(user, 'profile') else 'UTC'
        try:
            user_tz = pytz.timezone(user_tz_str)
        except pytz.UnknownTimeZoneError:
            user_tz = pytz.UTC

        now = timezone.now()
        local_now = now.astimezone(user_tz)
        today = local_now.date()
        this_month_start = today.replace(day=1)
        this_year_start = today.replace(month=1, day=1)

        metrics = qs.aggregate(
            total_goals=Count('id'),
            completed=Count('id', filter=Q(status='completed')),
            active=Count('id', filter=Q(status='in_progress')),
            archived=Count('id', filter=Q(is_archived=True)),
            favorite=Count('id', filter=Q(is_favorite=True)),
            average_progress=Avg('progress'),
            estimated_hours=Sum('estimated_hours'),
            actual_hours=Sum('actual_hours'),
            completed_this_month=Count('id', filter=Q(status='completed', completed_at__gte=this_month_start)),
            completed_this_year=Count('id', filter=Q(status='completed', completed_at__gte=this_year_start)),
            upcoming_deadlines=Count('id', filter=Q(target_date__gte=today, target_date__lte=today + timedelta(days=30), status__in=['not_started', 'in_progress']))
        )

        total = metrics['total_goals'] or 0
        completed = metrics['completed'] or 0
        metrics['completion_rate'] = round((completed / total * 100), 2) if total > 0 else 0

        metrics['average_progress'] = round(metrics['average_progress'] or 0.0, 2)
        metrics['estimated_hours'] = round(metrics['estimated_hours'] or 0.0, 2)
        metrics['actual_hours'] = round(metrics['actual_hours'] or 0.0, 2)

        return Response(metrics)
