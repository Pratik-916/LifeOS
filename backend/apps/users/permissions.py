from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """
    def has_object_permission(self, request, view, obj):
        # The exact field checking might depend on the model.
        # If it's a User model itself, it's obj == request.user
        # If it's a model belonging to User, it's obj.user == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user
