from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    """
    Standardize API errors to always return { success: False, message: "...", errors: { ... } }
    Maintains flat properties for frontend backward compatibility.
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            'success': False,
            'message': str(exc),
            'errors': response.data
        }
        
        # Shim for React frontend backward compatibility (e.g., non_field_errors at root)
        if isinstance(response.data, dict):
            for key, value in response.data.items():
                if key not in custom_data:
                    custom_data[key] = value

        response.data = custom_data

    return response
