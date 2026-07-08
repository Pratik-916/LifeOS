from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import JournalEntry
from .serializers import JournalEntrySerializer
from apps.users.permissions import IsOwner
from .services.journal_service import JournalService
from .services.journal_statistics_service import get_journal_stats

class JournalViewSet(viewsets.ModelViewSet):
    """
    CRUD for Journal Entries.
    """
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filterset_fields = ['status', 'visibility', 'mood', 'is_favorite', 'is_pinned']
    search_fields = ['title', 'content', 'summary', 'tags__name']
    ordering_fields = ['created_at', 'updated_at', 'word_count', 'reading_time', 'sentiment_score', 'writing_score']

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return JournalEntry.objects.none()
        return JournalEntry.objects.filter(user=self.request.user).prefetch_related('images', 'tags')

    def perform_create(self, serializer):
        # We handle creation via standard serializer save, the actual logic isn't heavily modified,
        # but to satisfy using the service we can pass user
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        JournalService.delete_journal(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        entry = get_object_or_404(JournalEntry.all_objects.filter(user=request.user), pk=pk)
        if entry.deleted_at:
            JournalService.restore_journal(entry)
            return Response({'status': 'journal restored'})
        return Response({'status': 'journal was not deleted'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        entry = self.get_object()
        is_fav = JournalService.toggle_favorite(entry)
        return Response({'status': 'favorite updated', 'is_favorite': is_fav})

    @action(detail=True, methods=['post'])
    def pin(self, request, pk=None):
        entry = self.get_object()
        is_pin = JournalService.toggle_pin(entry)
        return Response({'status': 'pin updated', 'is_pinned': is_pin})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = get_journal_stats(request.user)
        return Response(stats)
