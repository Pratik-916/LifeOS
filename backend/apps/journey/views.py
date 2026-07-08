from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Memory
from .serializers import MemorySerializer
from apps.users.permissions import IsOwner
from .services.journey_service import JourneyService
from .services.timeline_service import TimelineService
from .services.journey_statistics_service import JourneyStatisticsService

class MemoryViewSet(viewsets.ModelViewSet):
    """
    CRUD for Memories.
    """
    serializer_class = MemorySerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filterset_fields = ['category', 'visibility', 'favorite', 'pinned']
    search_fields = ['title', 'description', 'location', 'tags__name']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Memory.objects.none()
        return Memory.objects.filter(user=self.request.user).prefetch_related('images', 'tags')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        JourneyService.delete_memory(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        memory = get_object_or_404(Memory.all_objects.filter(user=request.user), pk=pk)
        if memory.deleted_at:
            JourneyService.restore_memory(memory)
            return Response({'status': 'memory restored'})
        return Response({'status': 'memory was not deleted'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        memory = self.get_object()
        is_fav = JourneyService.toggle_favorite(memory)
        return Response({'status': 'favorite updated', 'favorite': is_fav})

    @action(detail=True, methods=['post'])
    def pin(self, request, pk=None):
        memory = self.get_object()
        is_pin = JourneyService.toggle_pin(memory)
        return Response({'status': 'pin updated', 'pinned': is_pin})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = JourneyStatisticsService.get_statistics(request.user)
        return Response(stats)

    @action(detail=False, methods=['get'])
    def timeline(self, request):
        offset = int(request.query_params.get('offset', 0))
        limit = int(request.query_params.get('limit', 50))
        filters = {}
        # Simple extraction of query params to pass to timeline service
        if 'year' in request.query_params:
            filters['year'] = int(request.query_params['year'])
        if 'month' in request.query_params:
            filters['month'] = int(request.query_params['month'])
            
        events = TimelineService.get_timeline(request.user, filters=filters, limit=limit, offset=offset)
        
        # We manually construct a paginated style response since it's a DTO list, not a QuerySet
        return Response({
            'count': len(events), # In a real scale app, a separate count query or approximation is used
            'next': f"{request.build_absolute_uri(request.path)}?offset={offset+limit}&limit={limit}" if len(events) == limit else None,
            'previous': f"{request.build_absolute_uri(request.path)}?offset={max(0, offset-limit)}&limit={limit}" if offset > 0 else None,
            'results': events
        })

    @action(detail=False, methods=['get'], url_path=r'timeline/(?P<year>\d+)')
    def timeline_year(self, request, year=None):
        offset = int(request.query_params.get('offset', 0))
        limit = int(request.query_params.get('limit', 50))
        filters = {'year': int(year)}
        events = TimelineService.get_timeline(request.user, filters=filters, limit=limit, offset=offset)
        return Response({'results': events})
        
    @action(detail=False, methods=['get'], url_path=r'timeline/(?P<year>\d+)/(?P<month>\d+)')
    def timeline_year_month(self, request, year=None, month=None):
        offset = int(request.query_params.get('offset', 0))
        limit = int(request.query_params.get('limit', 50))
        filters = {'year': int(year), 'month': int(month)}
        events = TimelineService.get_timeline(request.user, filters=filters, limit=limit, offset=offset)
        return Response({'results': events})

