# Minerva

AI-powered contextual news intelligence platform. Provides instant, personalized explanations for unfamiliar terms, people, events, and concepts within news articles.

## Architecture

- **Backend**: FastAPI (Python 3.11+) — REST API + ingestion pipeline
- **Frontend**: Next.js 14 (TypeScript) — web app with entity highlighting
- **Database**: PostgreSQL (Supabase) — articles, entities, users
- **Cache**: Redis (Upstash) — context caching, rate limiting
- **Vectors**: Pinecone — semantic search via OpenAI embeddings
- **LLM**: OpenAI GPT-4o-mini / GPT-4o — context generation

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 20+
- Poetry (`pip install poetry`)

### Setup

```bash
# Clone and configure
git clone <repo-url>
cd minerva
cp .env.example .env
# Edit .env with your API keys

# Start infrastructure (Postgres + Redis)
make infra-up

# Install dependencies
make install

# Run database migrations
make migrate

# Start development servers
make dev-backend   # http://localhost:8000
make dev-frontend  # http://localhost:3000
```

### API Documentation

Once the backend is running, visit http://localhost:8000/docs for the interactive Swagger UI.

## Project Structure

```
minerva/
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── main.py          # Entry point
│   │   ├── config.py        # Settings
│   │   ├── models/          # SQLAlchemy ORM
│   │   ├── schemas/         # Pydantic models
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── ingestion/       # News pipeline
│   │   └── prompts/         # LLM templates
│   ├── migrations/          # Alembic
│   └── tests/
├── frontend/          # Next.js application
│   └── src/
│       ├── app/             # Pages (App Router)
│       ├── components/      # React components
│       ├── hooks/           # React Query hooks
│       ├── lib/             # API client, utils
│       └── types/           # TypeScript types
├── docker-compose.yml # Local dev infrastructure
├── Makefile           # Common commands
└── .env.example       # Environment template
```

## Common Commands

| Command | Description |
|---------|-------------|
| `make dev-backend` | Start FastAPI dev server |
| `make dev-frontend` | Start Next.js dev server |
| `make infra-up` | Start Postgres + Redis |
| `make test` | Run all tests |
| `make lint` | Run linters |
| `make migrate` | Run DB migrations |
| `make migrate-create` | Create new migration |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/feed` | Paginated article feed |
| GET | `/api/v1/articles/{id}` | Article with entities |
| GET | `/api/v1/articles/{id}/reference` | Full reference page |
| GET | `/api/v1/context/{entity_id}` | Entity context (RAG) |
| POST | `/api/v1/context/explain` | Follow-up question |
| GET | `/api/v1/search` | Semantic search |
