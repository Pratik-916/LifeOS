from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.blog.views import BlogViewSet, CategoryViewSet, PublicBlogViewSet

router = DefaultRouter()
router.register(r'posts', BlogViewSet, basename='blog-admin')
router.register(r'categories', CategoryViewSet, basename='blog-categories')
router.register(r'blog', PublicBlogViewSet, basename='blog-public')

urlpatterns = [
    path('', include(router.urls)),
]
