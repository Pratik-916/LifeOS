from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from apps.core.views import health_check

api_v1_urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('auth/', include('apps.authentication.urls')),
    path('users/', include('apps.users.urls')),
    path('tags/', include('apps.tags.urls')),
    path('planner/', include('apps.planner.urls')),
    path('goals/', include('apps.goals.urls')),
    path('habits/', include('apps.habits.urls')),
    path('journal/', include('apps.journal.urls')),
    path('journey/', include('apps.journey.urls')),
    path('analytics/', include('apps.analytics.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1_urlpatterns)),
    
    # Swagger Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
