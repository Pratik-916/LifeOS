from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Tag
from .serializers import TagSerializer
from django.utils.text import slugify

class TagViewSet(viewsets.ModelViewSet):
    """
    CRUD for Tags.
    Since Tags might be globally shared or strictly user-scoped based on requirements,
    we'll keep it simple: Tags are global but we only allow authenticated users to manage them.
    (If strict per-user tags are needed, we'd add user ForeignKey to Tag model).
    """
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['name', 'slug']
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
