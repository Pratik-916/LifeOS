from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    RegisterSerializer, 
    LoginSerializer, 
    LogoutSerializer, 
    ForgotPasswordSerializer, 
    ResetPasswordSerializer,
    ChangePasswordSerializer
)

class RegisterView(generics.CreateAPIView):
    """
    POST /api/v1/auth/register/
    Registers a new user and returns JWT tokens upon success.
    """
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Issue tokens immediately upon registration
        refresh = RefreshToken.for_user(user)
        # Add custom claims
        refresh['email'] = user.email
        refresh['first_name'] = user.first_name
        refresh['last_name'] = user.last_name

        return Response({
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """
    POST /api/v1/auth/login/
    Logs in a user and returns JWT tokens.
    """
    serializer_class = LoginSerializer


class LogoutView(generics.GenericAPIView):
    """
    POST /api/v1/auth/logout/
    Blacklists the provided refresh token.
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(generics.GenericAPIView):
    """
    POST /api/v1/auth/forgot-password/
    Simulates sending a password reset email.
    """
    permission_classes = (AllowAny,)
    serializer_class = ForgotPasswordSerializer

    def post(self, request, *args, **kwargs):
        # Placeholder for actual email sending logic
        return Response({"message": "If an account with that email exists, a reset link has been sent."})


class ResetPasswordView(generics.GenericAPIView):
    """
    POST /api/v1/auth/reset-password/
    Simulates resetting a password with a token.
    """
    permission_classes = (AllowAny,)
    serializer_class = ResetPasswordSerializer

    def post(self, request, *args, **kwargs):
        # Placeholder for actual token validation and password change
        return Response({"message": "Password successfully reset."})

class ChangePasswordView(generics.UpdateAPIView):
    """
    POST /api/v1/auth/change-password/
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
