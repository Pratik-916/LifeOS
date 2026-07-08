# API Layer & Integration

## Response Structure
The backend always responds with a standardized format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```
If an error occurs:
```json
{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Human readable message",
    "details": {}
  }
}
```

## DTO Mapping
The frontend API client unwraps the `data` payload automatically. 
However, since the backend uses `snake_case` (e.g., `due_date`, `is_completed`) and the frontend uses `camelCase` (e.g., `dueDate`, `isCompleted`), **Data Transfer Object (DTO) Mappers** are mandatory.
Each feature defines its mappers in `src/features/<name>/api/<name>.mapper.ts`.

## Pagination
List endpoints that return multiple items will return a `PaginatedResponse`:
```typescript
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
```
The frontend leverages `page` query parameters and `queryClient.prefetchQuery()` to load subsequent pages.
