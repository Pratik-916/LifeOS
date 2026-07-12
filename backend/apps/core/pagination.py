from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class MobileReadyPagination(PageNumberPagination):
    """
    Standard pagination for mobile and web.
    Includes page, page_size, count, next, and previous links.
    """
    page_size_query_param = 'page_size'
    
    def get_paginated_response(self, data):
        return Response({
            'page': self.page.number,
            'page_size': self.get_page_size(self.request),
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })
