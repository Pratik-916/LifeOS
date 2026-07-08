from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from apps.blog.models import BlogPost, BlogCategory, BlogStatus, BlogVisibility
from apps.blog.serializers import (
    BlogPostSerializer, BlogPostPublicSerializer, 
    BlogCategorySerializer, BlogStatisticsSerializer
)
from apps.blog.services.blog_service import BlogService
from apps.blog.services.blog_search_service import BlogSearchService
from apps.blog.services.blog_statistics_service import BlogStatisticsService


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [IsAuthenticated]


class BlogViewSet(viewsets.ModelViewSet):
    """
    Administrative API for Blog Posts. Uses UUID for lookups.
    """
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post = BlogService.create_post(self.request.user, serializer.validated_data)
        serializer.instance = post

    def perform_update(self, serializer):
        BlogService.update_post(self.get_object(), serializer.validated_data)

    def perform_destroy(self, instance):
        BlogService.soft_delete_post(instance)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        post = BlogPost.all_objects.get(pk=pk) # Need all_objects to bypass soft delete if manager filters it
        BlogService.restore_post(post)
        return Response({"status": "restored"})

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        post = self.get_object()
        BlogService.update_post(post, {'status': BlogStatus.PUBLISHED})
        return Response({"status": "published"})

    @action(detail=True, methods=['post'])
    def schedule(self, request, pk=None):
        post = self.get_object()
        date_str = request.data.get('published_at')
        from django.utils.dateparse import parse_datetime
        date = parse_datetime(date_str) if date_str else None
        BlogService.update_post(post, {'status': BlogStatus.SCHEDULED, 'published_at': date})
        return Response({"status": "scheduled"})

    @action(detail=True, methods=['post'])
    def feature(self, request, pk=None):
        post = self.get_object()
        BlogService.feature_post(post, request.data.get('featured', True))
        return Response({"status": "featured"})


class PublicBlogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public Read-Only API. Uses SLUG for lookups.
    """
    serializer_class = BlogPostPublicSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return BlogPost.objects.filter(
            status=BlogStatus.PUBLISHED,
            visibility=BlogVisibility.PUBLIC,
            deleted_at__isnull=True
        )

    @action(detail=False, methods=['get'])
    def latest(self, request):
        qs = self.get_queryset()[:10]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        filters = {
            'category_slug': request.query_params.get('category'),
            'tag': request.query_params.get('tag')
        }
        qs = BlogSearchService.search_posts(query, filters)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        post = self.get_object()
        # Simple related posts logic (same category, different post)
        qs = self.get_queryset().filter(category=post.category).exclude(id=post.id)[:3]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = BlogStatisticsService.get_statistics()
        serializer = BlogStatisticsSerializer(stats)
        return Response(serializer.data)
