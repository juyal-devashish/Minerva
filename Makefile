.PHONY: dev dev-backend dev-frontend infra-up infra-down test test-backend test-frontend lint format migrate migrate-create seed build clean install

# ============ Development ============

dev: infra-up dev-backend dev-frontend

dev-backend:
	cd backend && poetry run uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

# ============ Infrastructure ============

infra-up:
	docker-compose up -d

infra-down:
	docker-compose down

infra-logs:
	docker-compose logs -f

# ============ Install ============

install: install-backend install-frontend

install-backend:
	cd backend && poetry install

install-frontend:
	cd frontend && npm install

# ============ Database ============

migrate:
	cd backend && poetry run alembic upgrade head

migrate-create:
	@read -p "Migration message: " msg; \
	cd backend && poetry run alembic revision --autogenerate -m "$$msg"

seed:
	cd backend && poetry run python -m app.seed

# ============ Testing ============

test: test-backend test-frontend

test-backend:
	cd backend && poetry run pytest -v

test-frontend:
	cd frontend && npm test

test-coverage:
	cd backend && poetry run pytest --cov=app --cov-report=html

# ============ Code Quality ============

lint:
	cd backend && poetry run ruff check .
	cd frontend && npm run lint

format:
	cd backend && poetry run ruff format .

typecheck:
	cd backend && poetry run mypy app
	cd frontend && npm run typecheck

# ============ Build ============

build: build-backend build-frontend

build-backend:
	cd backend && docker build -t sama4-backend .

build-frontend:
	cd frontend && npm run build

# ============ Utilities ============

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .ruff_cache -exec rm -rf {} + 2>/dev/null || true
	rm -rf backend/htmlcov frontend/.next frontend/out

logs:
	docker-compose logs -f

shell-db:
	docker-compose exec postgres psql -U sama4 -d sama4
