# Backend Testing (Django)

## Frameworks
- `pytest`, `pytest-django`, `pytest-cov`, `factory_boy`

## Folder Structure
```
backend/
  tests/
    conftest.py
    factories/
    unit/
    api/
```

## Writing Tests
1. **Factories over Fixtures**: Define models using `factory_boy` in `tests/factories/`. Avoid static `.json` fixtures as they break during migrations.
2. **API Tests**: Use Django REST Framework's `APIClient` to validate endpoints. Assert on HTTP status codes and JSON payloads.
3. **Unit Tests**: Test models, serializers, and custom business logic directly.

## Running Tests
```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=. --cov-report=html
```
