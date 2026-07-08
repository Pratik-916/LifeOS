from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from .permissions import IsOwner

User = get_user_model()

class UserMeView(generics.RetrieveUpdateAPIView):
    """
    GET /api/v1/users/me/
    PATCH /api/v1/users/me/
    Returns and updates the currently authenticated user's profile and settings.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_object(self):
        return self.request.user
