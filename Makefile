.PHONY: help build lint format typecheck test test-coverage clean check-env

# Environment
PYTHON := python
NPM := npm

help:
	@echo "LifeOS Unified Makefile"
	@echo "Available commands:"
	@echo "  build         - Build all applications (Backend, Frontend, Mobile)"
	@echo "  lint          - Run linting across all applications"
	@echo "  format        - Run formatting across all applications"
	@echo "  typecheck     - Run type checking across Frontend and Mobile"
	@echo "  test          - Run tests across all applications"
	@echo "  test-coverage - Run tests with coverage across all applications"
	@echo "  clean         - Clean build artifacts across all applications"

# --- BACKEND ---
lint-backend:
	cd backend && $(PYTHON) -m ruff check .
	cd backend && $(PYTHON) -m black --check .

format-backend:
	cd backend && $(PYTHON) -m ruff check --fix .
	cd backend && $(PYTHON) -m black .

test-backend:
	cd backend && $(PYTHON) -m pytest

test-backend-coverage:
	cd backend && $(PYTHON) -m pytest --cov=. --cov-report=html --cov-report=xml

build-backend:
	cd backend && $(PYTHON) manage.py check --deploy
	cd backend && $(PYTHON) manage.py collectstatic --noinput

# --- FRONTEND ---
lint-frontend:
	cd frontend && $(NPM) run lint

format-frontend:
	cd frontend && $(NPM) run format

typecheck-frontend:
	cd frontend && $(NPM) run typecheck

test-frontend:
	cd frontend && $(NPM) run test

test-frontend-coverage:
	cd frontend && $(NPM) run test:coverage

build-frontend:
	cd frontend && $(NPM) run build

# --- MOBILE ---
lint-mobile:
	cd mobile && $(NPM) run lint

format-mobile:
	cd mobile && $(NPM) run format

typecheck-mobile:
	cd mobile && $(NPM) run typecheck

test-mobile:
	cd mobile && $(NPM) run test

test-mobile-coverage:
	cd mobile && $(NPM) run test:coverage

build-mobile:
	@echo "Mobile builds are handled via Expo EAS. See mobile/eas.json."

# --- GLOBAL COMMANDS ---
lint: lint-backend lint-frontend lint-mobile
format: format-backend format-frontend format-mobile
typecheck: typecheck-frontend typecheck-mobile
test: test-backend test-frontend test-mobile
test-coverage: test-backend-coverage test-frontend-coverage test-mobile-coverage
build: build-backend build-frontend build-mobile

clean:
	rm -rf backend/__pycache__ backend/.pytest_cache backend/htmlcov backend/coverage.xml
	rm -rf frontend/dist frontend/coverage
	rm -rf mobile/coverage
	rm -rf frontend/node_modules mobile/node_modules
