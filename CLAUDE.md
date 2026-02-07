# CLAUDE.md - Minerva Project Instructions

## Project Overview

**Minerva** is an AI-powered contextual news intelligence platform that provides instant, personalized explanations for unfamiliar terms, people, events, and concepts within news articles.

**Core Value Proposition**: Eliminate the friction between "I don't know this" and understanding—no tab-switching, no ChatGPT copy-paste, just inline context exactly when readers need it.

**Target Users**: Gen-Z and millennial news readers who churn from publications because articles assume prior knowledge they don't have.

---

## Tech Stack

### Backend Services
- **Language**: Python 3.11+
- **Framework**: FastAPI (async-first, high performance)
- **Task Queue**: Celery + Redis
- **Message Broker**: Apache Kafka
- **Scheduler**: Apache Airflow
- **API Gateway**: Kong or AWS API Gateway

### Databases
- **Primary DB**: PostgreSQL 15+ (source management, user data)
- **Document Store**: MongoDB (articles, processed content)
- **Knowledge Graph**: Neo4j (entity relationships)
- **Vector Store**: Pinecone or Weaviate (RAG embeddings)
- **Cache**: Redis (user profiles, hot context responses)

### ML/AI Stack
- **NER**: spaCy with fine-tuned transformer (en_core_web_trf base)
- **Embeddings**: sentence-transformers (all-MiniLM-L6-v2 or OpenAI ada-002)
- **LLM**: Claude API (primary) / Mistral 7B (fallback/cost optimization)
- **ML Framework**: PyTorch, Hugging Face Transformers

### Frontend / Client
- **Browser Extension**: Plasmo framework (React-based, cross-browser)
- **Web Dashboard**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand or Jotai

### Infrastructure
- **Cloud**: AWS (primary) or GCP
- **Containers**: Docker + Docker Compose (dev), Kubernetes (prod)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana, Sentry (errors)
- **Logging**: ELK Stack or CloudWatch

---

## Project Structure

```
minerva/
├── CLAUDE.md                     # This file - project instructions
├── README.md                     # Project overview and setup
├── docker-compose.yml            # Local development environment
├── docker-compose.prod.yml       # Production compose (reference)
├── Makefile                      # Common commands
├── .env.example                  # Environment variables template
├── .github/
│   └── workflows/
│       ├── ci.yml                # Test and lint on PR
│       ├── deploy-staging.yml    # Deploy to staging
│       └── deploy-prod.yml       # Deploy to production
│
├── services/
│   ├── api-gateway/              # Kong/custom gateway config
│   │
│   ├── articles-service/         # Article serving API
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   ├── src/
│   │   │   ├── main.py           # FastAPI app
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── repositories/
│   │   └── tests/
│   │
│   ├── context-service/          # Core product - context generation
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   ├── src/
│   │   │   ├── main.py
│   │   │   ├── routes/
│   │   │   │   └── context.py    # POST /context endpoint
│   │   │   ├── services/
│   │   │   │   ├── rag.py        # Retrieval-augmented generation
│   │   │   │   ├── llm.py        # LLM interface (Claude/Mistral)
│   │   │   │   └── knowledge.py  # Knowledge graph queries
│   │   │   ├── models/
│   │   │   │   ├── requests.py
│   │   │   │   └── responses.py
│   │   │   └── prompts/
│   │   │       └── context.py    # Prompt templates
│   │   └── tests/
│   │
│   ├── user-service/             # User management & profiles
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── src/
│   │       ├── main.py
│   │       ├── routes/
│   │       ├── services/
│   │       │   └── knowledge_profile.py  # What user knows
│   │       └── models/
│   │
│   └── ingestion/                # Content processing pipeline
│       ├── fetcher/              # Fetch from news sources
│       ├── deduplication/        # Remove duplicate articles
│       ├── cleaner/              # Extract clean text
│       ├── entity-extraction/    # NER + entity linking
│       │   ├── Dockerfile
│       │   ├── pyproject.toml
│       │   └── src/
│       │       ├── ner.py
│       │       ├── linker.py     # Link to Wikidata/Wikipedia
│       │       └── consumer.py   # Kafka consumer
│       └── summarization/        # Article summaries
│
├── ml/
│   ├── ner/
│   │   ├── training/             # Fine-tuning scripts
│   │   ├── evaluation/
│   │   └── models/               # Model artifacts (gitignored)
│   ├── embeddings/
│   │   └── indexer.py            # Build vector indices
│   └── experiments/              # Jupyter notebooks
│
├── clients/
│   ├── browser-extension/        # Plasmo-based extension
│   │   ├── package.json
│   │   ├── plasmo.config.ts
│   │   ├── src/
│   │   │   ├── background.ts     # Service worker
│   │   │   ├── content.tsx       # Content script (injected)
│   │   │   ├── popup.tsx         # Extension popup
│   │   │   ├── components/
│   │   │   │   ├── ContextPopup.tsx
│   │   │   │   └── HighlightedTerm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useContext.ts
│   │   │   └── services/
│   │   │       └── api.ts        # Minerva API client
│   │   └── assets/
│   │
│   └── web-dashboard/            # User dashboard (Next.js)
│       ├── package.json
│       ├── next.config.js
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── lib/
│       └── public/
│
├── infrastructure/
│   ├── terraform/                # Infrastructure as code
│   │   ├── modules/
│   │   ├── environments/
│   │   │   ├── staging/
│   │   │   └── production/
│   │   └── main.tf
│   ├── kubernetes/               # K8s manifests
│   │   ├── base/
│   │   └── overlays/
│   │       ├── staging/
│   │       └── production/
│   └── scripts/
│       ├── setup-local.sh
│       └── seed-db.sh
│
├── shared/
│   ├── python/                   # Shared Python utilities
│   │   ├── minerva_common/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── logging.py
│   │   │   ├── kafka.py
│   │   │   └── exceptions.py
│   │   └── pyproject.toml
│   └── proto/                    # Protobuf definitions (if needed)
│
└── docs/
    ├── architecture.md
    ├── api-spec.yaml             # OpenAPI spec
    ├── entity-schema.md
    └── deployment.md
```

---

## Development Guidelines

### Code Style & Standards

**Python**:
- Use `ruff` for linting and formatting (replaces black, isort, flake8)
- Type hints required for all function signatures
- Docstrings for public functions (Google style)
- Async-first for all I/O operations
- Pydantic for all data validation

```python
# Example service pattern
from pydantic import BaseModel
from typing import Optional

class ContextRequest(BaseModel):
    term: str
    article_url: str
    surrounding_text: str
    user_id: Optional[str] = None

class ContextResponse(BaseModel):
    term: str
    explanation: str
    sources: list[str]
    related_terms: list[str]
    confidence: float

async def get_context(request: ContextRequest) -> ContextResponse:
    """Generate contextual explanation for a term.
    
    Args:
        request: The context request containing term and article info.
        
    Returns:
        ContextResponse with explanation and metadata.
    """
    # Implementation
    ...
```

**TypeScript/JavaScript**:
- ESLint + Prettier
- Strict TypeScript mode
- Functional components with hooks
- Zod for runtime validation

### Git Workflow

```bash
main              # Production-ready code
├── staging       # Pre-production testing
└── feature/*     # Feature branches

# Branch naming
feature/context-service-rag
fix/entity-extraction-timeout
chore/update-dependencies
```

**Commit Messages** (Conventional Commits):
```
feat(context): add adaptive depth based on user profile
fix(ner): handle edge case with hyphenated names
docs(api): update OpenAPI spec for /context endpoint
perf(rag): cache frequent entity lookups in Redis
```

### Testing Requirements

- **Unit tests**: Required for all business logic (pytest)
- **Integration tests**: Required for API endpoints
- **E2E tests**: Required for critical user flows (Playwright)
- **Coverage**: Minimum 80% for core services

```bash
# Run tests
make test                    # All tests
make test-unit               # Unit only
make test-integration        # Integration only
make test-coverage           # With coverage report
```

---

## Service Specifications

### Context Service API

**POST /api/v1/context**

Primary endpoint - generates contextual explanation for a term.

```python
# Request
{
    "term": "Philip Glass",
    "article_url": "https://nytimes.com/...",
    "surrounding_text": "Philip Glass Withdraws From Kennedy Center...",
    "user_id": "usr_abc123",  # optional
    "depth": "auto"  # auto | brief | detailed
}

# Response
{
    "term": "Philip Glass",
    "explanation": "American composer known for minimalist music. One of the most influential composers of the late 20th century, famous for works like 'Einstein on the Beach' and film scores for 'The Hours' and 'Koyaanisqatsi'.",
    "sources": [
        {"title": "Wikipedia", "url": "https://en.wikipedia.org/wiki/Philip_Glass"},
        {"title": "Related: Kennedy Center Cancellations", "url": "..."}
    ],
    "related_terms": ["Kennedy Center", "National Symphony Orchestra", "minimalist music"],
    "confidence": 0.94,
    "cached": false,
    "latency_ms": 342
}
```

**Target Latency**: <500ms p95

**POST /api/v1/context/batch**

Batch endpoint for pre-processing article terms.

```python
# Request
{
    "article_url": "https://nytimes.com/...",
    "article_text": "Full article text...",
    "user_id": "usr_abc123"
}

# Response
{
    "highlightable_terms": [
        {"term": "Philip Glass", "start": 0, "end": 12, "type": "PERSON", "priority": "high"},
        {"term": "Kennedy Center", "start": 29, "end": 43, "type": "ORG", "priority": "high"},
        ...
    ],
    "pre_cached": 3  # Number of contexts pre-generated
}
```

### Entity Extraction Service

Kafka consumer that processes cleaned articles.

**Input Topic**: `cleaned_articles`
**Output Topic**: `articles_with_entities`

```python
# Message schema
{
    "article_id": "art_xyz789",
    "entities": [
        {
            "text": "Philip Glass",
            "type": "PERSON",
            "start_char": 0,
            "end_char": 12,
            "wikidata_id": "Q189729",
            "wikipedia_url": "https://en.wikipedia.org/wiki/Philip_Glass",
            "confidence": 0.97
        },
        ...
    ],
    "relationships": [
        {"source": "Philip Glass", "relation": "WITHDREW_FROM", "target": "Kennedy Center"}
    ]
}
```

---

## Environment Configuration

### Required Environment Variables

```bash
# .env.example

# Database
POSTGRES_URL=postgresql://user:pass@localhost:5432/minerva
MONGODB_URL=mongodb://localhost:27017/minerva
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
REDIS_URL=redis://localhost:6379

# Message Queue
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Vector Store
PINECONE_API_KEY=your-key
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX=minerva-entities

# LLM
ANTHROPIC_API_KEY=your-claude-key
OPENAI_API_KEY=your-openai-key  # For embeddings

# External APIs
WIKIPEDIA_API_URL=https://en.wikipedia.org/w/api.php
WIKIDATA_API_URL=https://www.wikidata.org/w/api.php

# Service Config
CONTEXT_SERVICE_PORT=8001
USER_SERVICE_PORT=8002
ARTICLES_SERVICE_PORT=8003
ENVIRONMENT=development  # development | staging | production

# Feature Flags
ENABLE_USER_PROFILES=true
ENABLE_CACHING=true
LLM_PROVIDER=anthropic  # anthropic | openai | mistral
```

---

## Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 20+
- Make

### Quick Start

```bash
# Clone and setup
git clone https://github.com/your-org/minerva.git
cd minerva
cp .env.example .env

# Start infrastructure (databases, kafka, etc.)
make infra-up

# Install dependencies
make install

# Run database migrations
make migrate

# Seed with sample data
make seed

# Start all services in development mode
make dev

# Or start individual services
make dev-context      # Context service only
make dev-extension    # Browser extension with hot reload
```

### Makefile Commands

```makefile
# Development
dev                 # Start all services
dev-context         # Start context service
dev-extension       # Start browser extension
dev-dashboard       # Start web dashboard

# Infrastructure
infra-up            # Start Docker infrastructure
infra-down          # Stop infrastructure
infra-logs          # View infrastructure logs

# Database
migrate             # Run all migrations
migrate-create      # Create new migration
seed                # Seed development data

# Testing
test                # Run all tests
test-unit           # Unit tests only
test-integration    # Integration tests
test-e2e            # End-to-end tests
test-coverage       # Generate coverage report

# Code Quality
lint                # Run linters
format              # Format code
typecheck           # Run type checking

# Build & Deploy
build               # Build all services
build-extension     # Build browser extension
deploy-staging      # Deploy to staging
deploy-prod         # Deploy to production (requires approval)

# Utilities
logs                # View service logs
shell-context       # Shell into context service
shell-db            # Connect to PostgreSQL
clean               # Clean build artifacts
```

---

## Deployment

### Staging Deployment

Triggered automatically on merge to `staging` branch.

```bash
# Manual staging deploy
make deploy-staging
```

### Production Deployment

Requires:
1. All tests passing
2. Staging verification
3. Manual approval in GitHub Actions

```bash
# Create release
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# This triggers production deployment workflow
```

### Infrastructure Provisioning

```bash
cd infrastructure/terraform/environments/staging

# Initialize
terraform init

# Plan changes
terraform plan -out=tfplan

# Apply
terraform apply tfplan
```

---

## Key Implementation Notes

### Context Generation Pipeline

```
User taps term
      │
      ▼
┌─────────────────┐
│ Check Redis     │──hit──▶ Return cached response
│ Cache           │
└────────┬────────┘
         │ miss
         ▼
┌─────────────────┐
│ Query Knowledge │──▶ Neo4j: entity info, relationships
│ Graph           │──▶ Get connected articles
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RAG Retrieval   │──▶ Pinecone: similar context chunks
│                 │──▶ Wikipedia API: current info
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Get User        │──▶ Redis: knowledge profile
│ Profile         │──▶ Determine explanation depth
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ LLM Generation  │──▶ Claude API with retrieved context
│                 │──▶ Prompt includes user's knowledge level
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cache & Return  │──▶ Store in Redis (TTL: 1 hour)
│                 │──▶ Update user profile (async)
└─────────────────┘
```

### Prompt Template (Context Generation)

```python
CONTEXT_PROMPT = """You are Minerva, an AI assistant that provides concise, contextual explanations for news readers.

TERM TO EXPLAIN: {term}
ARTICLE CONTEXT: {surrounding_text}
ARTICLE SOURCE: {article_source}

RETRIEVED KNOWLEDGE:
{retrieved_context}

USER KNOWLEDGE LEVEL: {knowledge_level}  # novice | intermediate | expert

INSTRUCTIONS:
1. Explain "{term}" in a way that helps understand the article
2. Be concise - {depth_instruction}
3. Focus on relevance to the current news context
4. Include only essential background, not exhaustive history
5. If the term relates to ongoing events, prioritize recent context

Provide your explanation in 1-3 sentences unless the user's knowledge level requires more depth.

EXPLANATION:"""
```

### Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Context API p50 latency | <300ms | <500ms |
| Context API p95 latency | <500ms | <1000ms |
| Entity extraction throughput | 100 articles/min | 50 articles/min |
| Cache hit rate | >60% | >40% |
| LLM cost per context | <$0.002 | <$0.005 |

---

## Monitoring & Alerts

### Key Metrics to Track

```yaml
# Business Metrics
- context_requests_total
- context_requests_by_term_type (person, org, event, concept)
- unique_users_daily
- contexts_per_user_session

# Performance Metrics  
- context_latency_seconds (histogram)
- cache_hit_rate
- llm_latency_seconds
- rag_retrieval_latency_seconds

# Error Metrics
- context_errors_total (by error_type)
- llm_rate_limit_hits
- entity_extraction_failures

# Infrastructure
- service_up (by service)
- database_connections_active
- kafka_consumer_lag
```

### Alert Thresholds

```yaml
critical:
  - context_api_error_rate > 5% for 5m
  - context_p95_latency > 2s for 5m
  - any service_up == 0

warning:
  - context_api_error_rate > 1% for 10m
  - cache_hit_rate < 40% for 30m
  - kafka_consumer_lag > 10000
```

---

## Security Considerations

1. **API Authentication**: JWT tokens for user-facing APIs
2. **Rate Limiting**: 100 requests/min for free tier, 1000 for paid
3. **Data Privacy**: User profiles stored with encryption at rest
4. **LLM Safety**: Input sanitization before LLM calls
5. **CORS**: Strict origin allowlist for browser extension

---

## Phase 1 MVP Scope (4 weeks)

**In Scope**:
- [ ] Context Service with basic RAG (Wikipedia + Wikidata)
- [ ] Chrome extension with term highlighting and popup
- [ ] Basic entity extraction (spaCy out-of-box)
- [ ] Redis caching for frequently requested terms
- [ ] User authentication (simple JWT)

**Out of Scope for MVP**:
- User knowledge profiles (adaptive depth)
- Publisher integrations
- Mobile apps
- Fine-tuned NER model
- Neo4j knowledge graph (use direct API calls initially)

---

## Commands for Claude Code

When working on this project, prefer these patterns:

```bash
# Starting a new service
cd services && mkdir new-service && cd new-service
# Create Dockerfile, pyproject.toml, src/ structure

# Running locally
docker-compose up -d postgres redis kafka
cd services/context-service && uvicorn src.main:app --reload

# Testing
pytest services/context-service/tests -v

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head

# Building extension
cd clients/browser-extension && pnpm dev

# Deploying
git push origin staging  # Auto-deploys to staging
```

---

## Resources & References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Plasmo Browser Extension Framework](https://docs.plasmo.com/)
- [spaCy NER Guide](https://spacy.io/usage/linguistic-features#named-entities)
- [LangChain RAG Patterns](https://python.langchain.com/docs/use_cases/question_answering/)
- [Claude API Documentation](https://docs.anthropic.com/)

---

*Last Updated: January 2026*
*Maintainer: Minerva Engineering Team*
