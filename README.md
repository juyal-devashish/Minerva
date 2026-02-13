# Minerva

AI powered contextual news intelligence platform. Provides instant, personalized explanations for unfamiliar terms, people, events, and concepts within news articles.

## Live Demo

- **Frontend**: [frontend-roan-nine-nf5erh3avr.vercel.app](https://frontend-roan-nine-nf5erh3avr.vercel.app)
- **Backend API docs**: http://localhost:8000/docs (local)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│  Next.js 14 (App Router) · React Query · Tailwind          │
│  Framer Motion · Poppins + Roboto · Mobile-first (393px)   │
│  Deployed on Vercel                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────────────┐
│                        Backend                              │
│  FastAPI · SQLAlchemy 2.0 (async) · Pydantic v2             │
│  spaCy en_core_web_trf · OpenAI GPT-4o-mini/GPT-4o         │
│  APScheduler (hourly ingestion)                             │
└──┬──────────┬──────────┬──────────┬─────────────────────────┘
   │          │          │          │
   ▼          ▼          ▼          ▼
PostgreSQL  Redis     Pinecone   OpenAI API
(Supabase)  (Upstash)  (vectors)  (LLM + embeddings)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, React Query, Tailwind CSS, Framer Motion, shadcn/ui |
| **Backend** | FastAPI, Python 3.12, SQLAlchemy 2.0 async, Pydantic v2 |
| **NER** | spaCy 3.8 with `en_core_web_trf` (transformer-based) |
| **LLM** | OpenAI GPT-4o-mini (context summaries), GPT-4o (follow-ups) |
| **Embeddings** | OpenAI `text-embedding-3-small` via Pinecone |
| **Database** | PostgreSQL 15 (Supabase prod, SQLite local dev) |
| **Cache** | Redis 7 (Upstash prod, local Docker) |
| **Vectors** | Pinecone (semantic search + RAG) |
| **Hosting** | Vercel (frontend), local/Docker (backend) |

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 20+
- Poetry (`pip install poetry`)

### Local Development (SQLite, no Docker needed)

```bash
git clone https://github.com/juyal-devashish/Minerva.git
cd Minerva
cp .env.example .env
# Edit .env with your OpenAI + Pinecone API keys

# Backend
cd backend
poetry install
poetry run python -m spacy download en_core_web_trf
poetry run uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

The backend auto-creates SQLite tables on startup and runs the ingestion scheduler hourly.

### With Docker (PostgreSQL + Redis)

```bash
docker-compose up -d              # Start Postgres + Redis
cd backend && poetry run alembic upgrade head  # Run migrations
cd backend && poetry run uvicorn app.main:app --reload --port 8000
cd frontend && npm run dev
```

### API Documentation

Once the backend is running: http://localhost:8000/docs

## Project Structure

```
minerva/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry + lifespan
│   │   ├── config.py            # Pydantic settings
│   │   ├── database.py          # SQLAlchemy engine (Postgres/SQLite)
│   │   ├── models/              # ORM models
│   │   │   ├── article.py       # Article, categories, content
│   │   │   ├── entity.py        # Entity, ArticleEntity (join)
│   │   │   ├── source.py        # News source feeds
│   │   │   └── user.py          # User model
│   │   ├── schemas/             # Pydantic request/response
│   │   │   ├── feed.py          # FeedResponse, ArticleSummary
│   │   │   ├── article.py       # ArticleDetail, EntityInArticle
│   │   │   ├── context.py       # ContextResponse, ExplainResponse
│   │   │   └── common.py        # Pagination
│   │   ├── routers/             # API endpoints
│   │   │   ├── feed.py          # GET /api/v1/feed
│   │   │   ├── articles.py      # GET /api/v1/articles/{id}
│   │   │   ├── context.py       # GET /api/v1/context/{entity_id}
│   │   │   └── search.py        # GET /api/v1/search
│   │   ├── services/            # Business logic
│   │   │   ├── context_service.py   # Core RAG pipeline
│   │   │   ├── llm_service.py       # OpenAI wrapper
│   │   │   ├── embedding_service.py # Pinecone vectors
│   │   │   ├── entity_service.py    # Entity CRUD
│   │   │   ├── cache_service.py     # Redis caching
│   │   │   └── rate_limiter.py      # Rate limiting
│   │   ├── ingestion/           # News processing pipeline
│   │   │   ├── pipeline.py      # Orchestrator
│   │   │   ├── fetcher.py       # RSS feed fetcher
│   │   │   ├── cleaner.py       # HTML → clean text
│   │   │   ├── dedup.py         # MinHash deduplication
│   │   │   ├── ner.py           # spaCy entity extraction
│   │   │   ├── linker.py        # Wikidata/Wikipedia linking
│   │   │   ├── summarizer.py    # GPT-4o-mini summaries
│   │   │   ├── embedder.py      # Pinecone article embeddings
│   │   │   ├── scheduler.py     # APScheduler (hourly runs)
│   │   │   └── sources.py       # RSS feed URLs
│   │   └── prompts/
│   │       └── templates.py     # LLM prompt templates
│   ├── migrations/              # Alembic (PostgreSQL)
│   ├── tests/                   # pytest test suite
│   └── pyproject.toml           # Poetry dependencies
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── layout.tsx       # Root layout (Poppins + Roboto)
│       │   ├── page.tsx         # Tab-based SPA (Feed, Search, etc.)
│       │   ├── providers.tsx    # React Query provider
│       │   └── article/[id]/   # Article detail + reference routes
│       ├── components/
│       │   ├── feed/            # ArticleCard, CategoryTabs, FeedList
│       │   ├── article/         # ArticleView, EntityHighlight, HighlightedText
│       │   ├── context/         # ContextPopup (animated bottom sheet)
│       │   ├── reference/       # ReferencePage (grouped entities)
│       │   ├── navigation/      # BottomTabBar (5 tabs)
│       │   ├── search/          # SearchScreen
│       │   ├── profile/         # ProfileScreen (dark mode toggle)
│       │   ├── onboarding/      # OnboardingScreen (3-step flow)
│       │   └── ui/              # EntityBadge, PlaceholderScreen, Button, Card
│       ├── hooks/               # useFeed, useArticle, useEntityContext, etc.
│       ├── lib/                 # api.ts (fetch wrapper), queryClient
│       ├── types/               # TypeScript interfaces
│       └── styles/globals.css   # Figma design tokens (light + dark)
│
├── docker-compose.yml           # PostgreSQL 15 + Redis 7
├── Makefile                     # dev, test, lint, build commands
└── .env.example                 # Environment template
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/feed` | Paginated article feed (supports `?category=`, `?page=`, `?limit=`) |
| GET | `/api/v1/articles/{id}` | Article detail with entities (positions, types, priorities) |
| GET | `/api/v1/articles/{id}/reference` | Reference page — entities grouped by type with context |
| GET | `/api/v1/context/{entity_id}` | Entity context via RAG (Wikipedia + LLM generation) |
| POST | `/api/v1/context/explain` | Follow-up question about an entity |
| GET | `/api/v1/search` | Semantic search via Pinecone |

## Ingestion Pipeline

Runs hourly via APScheduler. Processes RSS feeds through:

```
Fetch (RSS) → Dedup (MinHash) → Clean (HTML strip) → NER (spaCy en_core_web_trf)
→ Link (Wikidata/Wikipedia) → Summarize (GPT-4o-mini) → Embed (Pinecone) → Store
```

**News sources**: BBC, NYT, Reuters, Al Jazeera, The Guardian, NPR, AP News, Ars Technica, and more.

## Frontend Design

Mobile-first design (393px) with Figma-matched design system:

- **Typography**: Poppins (headings/UI) + Roboto (body)
- **Colors**: Hex-based CSS custom properties with light/dark mode
- **Navigation**: Bottom tab bar (Feed, Search, Bookmarks, Trending, Profile)
- **Article cards**: Hero (full-width), Standard (with image), Compact (thumbnail)
- **Entity highlighting**: Gold underlines with priority-based styling
- **Context popup**: Animated bottom sheet (Framer Motion spring animation)
- **Onboarding**: 3-step flow with category selection
- **Dark mode**: Toggle in Profile, persisted to localStorage

## Common Commands

| Command | Description |
|---------|-------------|
| `make dev-backend` | Start FastAPI dev server on :8000 |
| `make dev-frontend` | Start Next.js dev server on :3000 |
| `make install` | Install all dependencies (Poetry + npm) |
| `make test` | Run backend + frontend tests |
| `make lint` | Run ruff (backend) + ESLint (frontend) |
| `make format` | Format Python code with ruff |
| `make typecheck` | Run mypy + tsc |
| `make build` | Build Docker image + Next.js |
| `make seed` | Seed database with sample data |
| `make migrate` | Run Alembic migrations (PostgreSQL) |

## Environment Variables

See [.env.example](.env.example) for the full list. Key variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | GPT-4o-mini summaries + embeddings |
| `PINECONE_API_KEY` | Yes | Vector search |
| `DATABASE_URL` | No | Defaults to SQLite for local dev |
| `REDIS_URL` | No | Defaults to localhost:6379 |
| `NEXT_PUBLIC_API_URL` | No | Frontend → backend URL (default: http://localhost:8000) |

## Tests

```bash
cd backend && poetry run pytest -v    # 6 tests (health, cleaner, dedup)
cd frontend && npm run build          # Type-checks + builds (0 errors)
```
