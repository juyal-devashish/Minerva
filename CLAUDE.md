# CLAUDE.md - samā4 Project Instructions

## Project Overview

**samā4** is an AI-powered contextual news intelligence platform that provides instant explanations for unfamiliar terms, people, events, and concepts within news articles.

**Core Value Proposition**: Eliminate the friction between "I don't know this" and understanding — no tab-switching, no ChatGPT copy-paste, just inline context exactly when readers need it.

**Target Users**: Gen-Z and millennial news readers who churn from publications because articles assume prior knowledge they don't have.

---

## Architecture (Actual Implementation)

samā4 uses a **monolithic backend + SPA frontend** architecture:

```
Frontend (Next.js 14 on Vercel)
    ↕ REST JSON
Backend (FastAPI monolith on :8000)
    ↕
PostgreSQL / SQLite  ·  Redis  ·  Pinecone  ·  OpenAI API
```

### Backend (`backend/`)
- **Language**: Python 3.12 (managed via Poetry)
- **Framework**: FastAPI with async SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **NER**: spaCy 3.8 with `en_core_web_trf` transformer model
- **LLM**: OpenAI GPT-4o-mini (summaries, context) and GPT-4o (follow-ups)
- **Embeddings**: OpenAI `text-embedding-3-small` via Pinecone
- **Database**: PostgreSQL 15 (production via Supabase) or SQLite (local dev, auto-created)
- **Cache**: Redis 7 (production via Upstash, local via Docker)
- **Vectors**: Pinecone (article embeddings for semantic search + RAG)
- **Scheduler**: APScheduler (hourly ingestion pipeline)
- **Error tracking**: Sentry (optional, initialized at module level before app creation)

### Frontend (`frontend/`)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Data fetching**: React Query (TanStack Query v5)
- **Styling**: Tailwind CSS 3.4 with hex-based CSS custom properties
- **Animation**: Framer Motion (entity context bottom sheet)
- **UI components**: shadcn/ui (Button, Card) + custom Figma-matched components
- **Typography**: Poppins (headings/UI/buttons) + Roboto (body text)
- **Design**: Mobile-first (393px max-width), light/dark mode
- **Deployment**: Vercel

---

## Project Structure

```
sama4/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry + lifespan (scheduler, table creation)
│   │   ├── config.py            # Pydantic settings (env vars)
│   │   ├── database.py          # SQLAlchemy engine (auto-detects Postgres vs SQLite)
│   │   ├── dbtypes.py           # Cross-DB type compatibility
│   │   ├── models/
│   │   │   ├── article.py       # Article model (content, summary, categories)
│   │   │   ├── entity.py        # Entity + ArticleEntity join table
│   │   │   ├── source.py        # News source (feed URL, credibility)
│   │   │   └── user.py          # User model
│   │   ├── schemas/
│   │   │   ├── feed.py          # FeedResponse, ArticleSummary, Pagination
│   │   │   ├── article.py       # ArticleDetail, EntityInArticle
│   │   │   ├── context.py       # ContextResponse, ExplainRequest/Response
│   │   │   └── common.py        # Shared pagination schema
│   │   ├── routers/
│   │   │   ├── feed.py          # GET /api/v1/feed (?category, ?page, ?limit)
│   │   │   ├── articles.py      # GET /api/v1/articles/{id}, GET .../reference
│   │   │   ├── context.py       # GET /api/v1/context/{entity_id}, POST .../explain
│   │   │   └── search.py        # GET /api/v1/search
│   │   ├── services/
│   │   │   ├── context_service.py   # Core RAG pipeline (cache → Pinecone → LLM)
│   │   │   ├── llm_service.py       # OpenAI GPT-4o-mini / GPT-4o wrapper
│   │   │   ├── embedding_service.py # Pinecone upsert + query
│   │   │   ├── entity_service.py    # Entity CRUD operations
│   │   │   ├── cache_service.py     # Redis get/set with TTL
│   │   │   └── rate_limiter.py      # Token-bucket rate limiting
│   │   ├── ingestion/
│   │   │   ├── pipeline.py      # Full orchestrator: fetch→dedup→clean→NER→link→summarize→embed→store
│   │   │   ├── fetcher.py       # RSS/Atom feed fetcher (feedparser + httpx)
│   │   │   ├── cleaner.py       # HTML stripping, content hashing, reading time
│   │   │   ├── dedup.py         # MinHash + LSH deduplication (datasketch)
│   │   │   ├── ner.py           # spaCy en_core_web_trf entity extraction
│   │   │   ├── linker.py        # Wikidata API + Wikipedia API entity linking
│   │   │   ├── summarizer.py    # GPT-4o-mini article summarization
│   │   │   ├── embedder.py      # Pinecone article embedding (text-embedding-3-small)
│   │   │   ├── scheduler.py     # APScheduler (runs pipeline every hour)
│   │   │   └── sources.py       # RSS feed URLs (BBC, NYT, Reuters, etc.)
│   │   └── prompts/
│   │       └── templates.py     # LLM prompt templates (context, follow-up, summary)
│   ├── migrations/              # Alembic migrations (PostgreSQL only)
│   ├── tests/
│   │   ├── test_routers/        # API endpoint tests
│   │   ├── test_services/       # Service unit tests
│   │   └── test_ingestion/      # Pipeline tests (cleaner, dedup)
│   └── pyproject.toml
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout (Poppins + Roboto fonts)
│   │   │   ├── page.tsx             # Tab-based SPA with SwipeableHome landing (CardSwiper ↔ FeedList)
│   │   │   ├── providers.tsx        # React Query provider
│   │   │   ├── article/[id]/
│   │   │   │   ├── page.tsx         # Article detail route
│   │   │   │   └── reference/page.tsx  # Reference page route
│   │   │   └── search/page.tsx      # Search route (unused, SPA tab used instead)
│   │   ├── components/
│   │   │   ├── SplashScreen.tsx     # Animated splash (text → logo → fade out)
│   │   │   ├── feed/
│   │   │   │   ├── SwipeableHome.tsx # Horizontal swipe: CardSwiper ↔ FeedList
│   │   │   │   ├── CardSwiper.tsx   # Full-page vertical scroll-snap swiper + entity detail fetch + ContextPopup
│   │   │   │   ├── FullPageCard.tsx  # Full-screen card with inline entity highlights on summary
│   │   │   │   ├── ArticleCard.tsx  # 3 variants: hero, standard, compact
│   │   │   │   ├── CategoryTabs.tsx # Chip-style category filter
│   │   │   │   └── FeedList.tsx     # Traditional feed (hero first + standard rest)
│   │   │   ├── article/
│   │   │   │   ├── ArticleView.tsx      # Full article with scroll progress, hero image
│   │   │   │   ├── ArticleContent.tsx   # Content wrapper
│   │   │   │   ├── HighlightedText.tsx  # Entity text segmentation
│   │   │   │   ├── EntityHighlight.tsx  # Tappable entity spans (gold underlines)
│   │   │   │   └── ArticleHeader.tsx    # Legacy header component
│   │   │   ├── context/
│   │   │   │   ├── ContextPopup.tsx     # Animated bottom sheet (framer-motion)
│   │   │   │   ├── ContextCard.tsx      # Legacy card component
│   │   │   │   └── FollowupInput.tsx    # Follow-up question input
│   │   │   ├── reference/
│   │   │   │   ├── ReferencePage.tsx     # Entities grouped by type, expandable
│   │   │   │   ├── EntityList.tsx       # Legacy entity list
│   │   │   │   └── RelatedArticles.tsx  # Related articles section
│   │   │   ├── navigation/
│   │   │   │   └── BottomTabBar.tsx     # 5-tab bottom bar (Feed, Search, Bookmarks, Trending, Profile)
│   │   │   ├── search/
│   │   │   │   └── SearchScreen.tsx     # Search with recent searches + compact results
│   │   │   ├── profile/
│   │   │   │   └── ProfileScreen.tsx    # Settings, dark mode toggle
│   │   │   ├── onboarding/
│   │   │   │   └── OnboardingScreen.tsx # 3-step onboarding + category selection
│   │   │   └── ui/
│   │   │       ├── entity-badge.tsx     # Color-coded entity type badges
│   │   │       ├── PlaceholderScreen.tsx # Generic placeholder (bookmarks, trending)
│   │   │       ├── button.tsx           # shadcn/ui Button
│   │   │       └── card.tsx             # shadcn/ui Card
│   │   ├── hooks/
│   │   │   ├── useFeed.ts          # Feed query with category + pagination
│   │   │   ├── useArticle.ts       # Article detail query
│   │   │   ├── useEntityContext.ts  # Entity context query
│   │   │   ├── useReferencePage.ts  # Reference page query
│   │   │   └── usePrefetch.ts      # Prefetch utilities
│   │   ├── lib/
│   │   │   ├── api.ts              # Fetch wrapper (all API calls)
│   │   │   ├── queryClient.ts      # React Query client config
│   │   │   └── utils.ts            # cn() utility + formatTimeAgo()
│   │   ├── types/index.ts          # All TypeScript interfaces
│   │   └── styles/globals.css      # Figma design tokens (light + dark mode)
│   ├── tailwind.config.js          # Hex-based color tokens
│   ├── tsconfig.json               # strict: true
│   └── package.json
│
├── src-2/                      # New design reference (full-page card swiper prototype)
├── figma_src/                  # Figma design reference components
├── docker-compose.yml          # PostgreSQL 15 + Redis 7 (local dev)
├── Makefile                    # Common dev commands
├── .env.example                # Environment template
└── .github/workflows/          # CI (ci.yml) + deploy to Railway (deploy.yml)
```

---

## Development Guidelines

### Code Style

**Python** (backend):
- `ruff` for linting and formatting
- Type hints required on all function signatures
- Google-style docstrings for public functions
- Async-first for all I/O operations
- Pydantic v2 for all data validation
- ruff ignores E501 in `app/prompts/templates.py` (long template strings)

**TypeScript** (frontend):
- ESLint (next config) for linting
- `strict: true` in tsconfig.json
- Functional components with hooks
- React Query for all server state

### Git Workflow

```bash
main              # Production-ready code

# Branch naming
feature/context-service-rag
fix/entity-extraction-timeout
chore/update-dependencies
```

**Commit Messages** (Conventional Commits):
```
feat(context): add adaptive depth based on user profile
fix(ner): handle edge case with hyphenated names
chore(deps): update spacy to 3.8
```

### Testing

```bash
cd backend && poetry run pytest -v           # 6 tests passing
cd frontend && npm run build                 # Type-check + build (0 errors)
cd backend && poetry run pytest --cov=app    # Coverage report
```

---

## Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/feed` | Paginated feed (`?category=`, `?page=`, `?limit=`) |
| GET | `/api/v1/articles/{id}` | Article with entities (positions + types + priorities) |
| GET | `/api/v1/articles/{id}/reference` | Reference page — entities grouped by type |
| GET | `/api/v1/context/{entity_id}` | Entity context via RAG pipeline |
| POST | `/api/v1/context/explain` | Follow-up question about an entity |
| GET | `/api/v1/search` | Semantic search via Pinecone |

---

## Ingestion Pipeline

Runs hourly via APScheduler. Each source processed independently.

```
RSS Fetch → MinHash Dedup → HTML Clean → spaCy NER (en_core_web_trf)
→ Wikidata/Wikipedia Link → GPT-4o-mini Summarize → Pinecone Embed → DB Store
```

News sources configured in `backend/app/ingestion/sources.py`:
BBC, NYT, Reuters, Al Jazeera, The Guardian, NPR, AP News, Ars Technica, and more.

---

## Context Generation Pipeline (RAG)

```
User taps entity → Check Redis cache
    ↓ (miss)
Query Pinecone for similar context chunks
    ↓
Fetch Wikipedia summary via API
    ↓
Build prompt with article context + retrieved knowledge
    ↓
LLM generation (GPT-4o-mini for context, GPT-4o for follow-ups)
    ↓
Cache in Redis (TTL: 24h for entity context, 6h for LLM responses)
    ↓
Return to frontend
```

---

## Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...            # GPT-4o-mini summaries + embeddings
PINECONE_API_KEY=...             # Vector store

# Optional (defaults work for local dev)
DATABASE_URL=sqlite+aiosqlite:///./sama4.db  # Auto-detected; use postgresql+asyncpg://... for Postgres
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=["http://localhost:3000"]
SENTRY_DSN=                      # Optional error tracking

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Local Development Commands

```bash
# Backend
cd backend && poetry run uvicorn app.main:app --reload --port 8000
cd backend && poetry run pytest -v
cd backend && poetry run ruff check .
cd backend && poetry run ruff format .
cd backend && poetry run alembic upgrade head   # PostgreSQL only

# Frontend
cd frontend && npm run dev          # Dev server on :3000
cd frontend && npm run build        # Production build
cd frontend && npm run lint         # ESLint
cd frontend && npm run typecheck    # tsc --noEmit

# Makefile shortcuts
make dev-backend     # uvicorn with reload
make dev-frontend    # next dev
make install         # poetry install + npm install
make test            # pytest + npm test
make lint            # ruff + eslint
make migrate         # alembic upgrade head
make seed            # seed sample data
```

---

## Frontend Design System

### Colors (CSS custom properties in `globals.css`)

**Light mode**: `--background: #FAFAFA`, `--foreground: #1A1A2E`, `--accent-primary: #0D1B3E` (deep navy)
**Dark mode**: `--background: #0A0A14`, `--foreground: #EAEAF0`, `--accent-primary: #6B9FD4` (light blue)

**Entity type colors**: person=#4A7AB5, organization=#7A5AB5, event=#B5764A, concept=#4AB58A, location=#B54A6E

### Typography
- **Poppins**: h1-h4, buttons, labels, navigation (weights: 400, 500, 600, 800)
- **Roboto**: body text, paragraphs, inputs (weights: 400, 500)

### Key UI Patterns
- Mobile-first: `max-w-[393px] mx-auto` container
- **Splash screen**: Animated intro — "samā4" text (phase 0) → owl logo + "News, understood" tagline (phase 1) → fade out (phase 2)
- **Landing page**: Full-page card swiper (CardSwiper) with vertical scroll-snap — default view on app open
- **Swipeable feed**: Horizontal swipe (react-swipeable) toggles between CardSwiper (default) and traditional FeedList
- **View indicator**: Bottom dots show which view is active (card swiper vs feed list)
- **Card-level entity highlights**: Summary text on FullPageCard has inline entity highlighting via text-matching (entities fetched from article detail API). Tap opens ContextPopup directly from card — no need to enter article detail view
- Entity highlighting: gold background (`--entity-highlight: #F5E6C8`) + entity-type-colored borders (person=#4A7AB5, org=#7A5AB5, event=#B5764A, concept=#4AB58A, location=#B54A6E)
- Bottom sheet: framer-motion spring animation (damping: 25, stiffness: 300)
- Category chips: filled (active) vs outlined (inactive)
- Article cards: full-page (card swiper, 35% image), hero (400px), standard (180px), compact (72x72 thumb)

---

## Deployment

- **Frontend**: Deployed on Vercel at `frontend-roan-nine-nf5erh3avr.vercel.app`
- **Backend**: Run locally or via Docker. Set `NEXT_PUBLIC_API_URL` on Vercel to connect.

```bash
# Deploy frontend to Vercel
cd frontend && vercel --prod --token $VERCEL_TOKEN

# Docker infrastructure (Postgres + Redis)
docker-compose up -d
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Context API p50 latency | <300ms |
| Context API p95 latency | <500ms |
| Cache hit rate | >60% |
| LLM cost per context | <$0.002 |

---

*Last Updated: February 2026*
