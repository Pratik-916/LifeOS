from rest_framework.renderers import JSONRenderer

class CustomJSONRenderer(JSONRenderer):
    """
    Standardize all API responses into:
    {
      "success": True/False,
      "message": "...",
      "data": { ... } or None,
      "error": { ... } or None
    }
    """
    def render(self, data, accepted_media_type=None, renderer_context=None):
        # Allow DRF spectacular to get its schema unharmed
        if renderer_context and renderer_context['view'].__class__.__name__ == 'SpectacularAPIView':
            return super().render(data, accepted_media_type, renderer_context)

        response = renderer_context.get('response') if renderer_context else None
        status_code = response.status_code if response else 200

        # If data is already standardized from custom exception handler, pass it through
        if isinstance(data, dict) and 'success' in data and 'error' in data:
            return super().render(data, accepted_media_type, renderer_context)

        # Standardize success response
        if status_code >= 200 and status_code < 400:
            success_data = {
                'success': True,
                'message': data.pop('message', 'Success') if isinstance(data, dict) and 'message' in data else 'Success',
                'data': data
            }
            return super().render(success_data, accepted_media_type, renderer_context)
        
        # If somehow we get here with an error status that wasn't caught by the exception handler
        error_data = {
            'success': False,
            'error': {
                'code': 'error',
                'message': 'An error occurred',
                'details': data
            }
        }
        return super().render(error_data, accepted_media_type, renderer_context)
