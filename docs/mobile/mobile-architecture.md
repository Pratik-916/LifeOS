# Mobile API Strategy

## Architectural Design
The LifeOS backend serves both the React web application and future React Native apps. 

### Data Transfer Objects (DTOs)
The Django REST Framework serializers are the single source of truth for all DTOs. Do not create separate "Mobile Serializers".
- **Nested Models**: We aggressively prefetch nested models (`tags`, `images`, `subtasks`) using Django's `prefetch_related` in viewsets to avoid N+1 query latency on mobile networks.
- **Dates**: All dates are output via `serializers.DateTimeField` in ISO-8601 format, guaranteed to be UTC. The mobile client is responsible for local timezone formatting.

### Networking
Mobile apps should wrap the standard `axios` or `fetch` APIs with an interceptor that handles JWT logic seamlessly.
- **Offline Support**: The backend uses Optimistic Locking (`version`, `last_updated_at`) to ensure sync safety when offline apps come back online.
- **File Uploads**: Mobile applications must upload media using `multipart/form-data`. The backend `ImageField` is fully compatible with Native device uploads.

### State Management
It is heavily recommended to use React Query or RTK Query for the React Native application. This perfectly aligns with the current web implementation, minimizing cognitive load for developers moving between platforms.
