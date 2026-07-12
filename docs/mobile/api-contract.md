# API Contract Reference

## Standard Success Response
All endpoints return a wrapper object:
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... } // Payload or Paginated Object
}
```

## Standard Pagination Object
Lists are paginated natively. Inside the `data` block, you will find:
```json
{
  "page": 1,
  "page_size": 20,
  "count": 145,
  "next": "http://api.lifeos.com/api/v1/planner/tasks/?page=2",
  "previous": null,
  "results": [...]
}
```

## Standard Error Response
Validation and server errors are returned in a unified format:
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "title": ["This field is required."],
    "non_field_errors": ["End date must be after start date."]
  }
}
```

**Backward Compatibility Shim:** 
To prevent breaking legacy React web views, the `errors` keys are also temporarily flattened into the root response dictionary. Mobile applications **must only** read from `errors`.
