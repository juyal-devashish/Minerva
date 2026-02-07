# Minerva - System Architecture Document

> **Version**: 1.0 (MVP)
> **Last Updated**: February 2026
> **Status**: Ready for Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Architecture Overview](#3-architecture-overview)
4. [Tech Stack](#4-tech-stack)
5. [Data Ingestion Pipeline](#5-data-ingestion-pipeline)
6. [Entity Extraction & Enrichment](#6-entity-extraction--enrichment)
7. [Storage Layer](#7-storage-layer)
8. [API Layer](#8-api-layer)
9. [RAG & LLM Orchestration](#9-rag--llm-orchestration)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Infrastructure & Deployment](#11-infrastructure--deployment)
12. [Cost Analysis](#12-cost-analysis)
13. [Development Roadmap](#13-development-roadmap)

---

## 1. Executive Summary

**Minerva** is an AI-powered contextual news intelligence platform that provides instant, personalized explanations for unfamiliar terms, people, events, and concepts within news articles.

### Core Value Proposition
Eliminate the friction between "I don't know this" and understanding—no tab-switching, no ChatGPT copy-paste, just inline context exactly when readers need it.

### Target Users
Gen-Z and millennial news readers who churn from publications because articles assume prior knowledge they don't have.

### MVP Scope
- Web application (mobile-friendly, ready for native app transition)
- ~100 beta users
- Broad news coverage via RSS aggregation
- Two interaction modes:
  - **Proactive**: Highlighted entities, tap to expand
  - **On-demand**: Swipe left for full reference page

---

## 2. Product Overview

### 2.1 User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. DISCOVER                    2. READ                     3. UNDERSTAND   │
│  ───────────                    ────────                    ─────────────   │
│                                                                              │
│  ┌─────────────┐               ┌─────────────┐             ┌─────────────┐ │
│  │             │               │             │             │             │ │
│  │    Feed     │──── tap ────▶│   Article   │── tap ────▶│   Context   │ │
│  │             │               │    View     │   entity    │   Popup     │ │
│  │  • Cards    │               │             │             │             │ │
│  │  • Swipe    │               │ • Highlight │             │ • Explain   │ │
│  │  • Filter   │               │   entities  │             │ • Sources   │ │
│  │             │               │             │             │ • Follow-up │ │
│  └─────────────┘               └──────┬──────┘             └─────────────┘ │
│                                       │                                     │
│                                       │ swipe left                          │
│                                       ▼                                     │
│                                ┌─────────────┐                              │
│                                │  Reference  │                              │
│                                │    Page     │                              │
│                                │             │                              │
│                                │ • All terms │                              │
│                                │ • Related   │                              │
│                                │   articles  │                              │
│                                │ • Timeline  │                              │
│                                └─────────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| News Feed | Aggregated, categorized news cards | P0 |
| Article View | Full article with highlighted entities | P0 |
| Context Popup | Tap entity for instant explanation | P0 |
| Reference Page | Swipe left for all context | P0 |
| Follow-up Q&A | Ask questions about entities | P1 |
| Related Articles | Semantic similarity suggestions | P1 |
| Prefetching | Preload next article + reference | P1 |

---

## 3. Architecture Overview

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MINERVA ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                         CLIENTS                                  │     │
│    │                                                                  │     │
│    │         Web App (Next.js)              Mobile (Future)          │     │
│    │              │                              │                    │     │
│    └──────────────┼──────────────────────────────┼────────────────────┘     │
│                   │                              │                          │
│                   └──────────────┬───────────────┘                          │
│                                  │                                          │
│                                  ▼                                          │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                     VERCEL (Frontend)                            │     │
│    │                                                                  │     │
│    │    Next.js 14 + React Query + shadcn/ui + Tailwind              │     │
│    │                                                                  │     │
│    └─────────────────────────────────────────────────────────────────┘     │
│                                  │                                          │
│                                  │ REST API                                 │
│                                  ▼                                          │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                     RAILWAY (Backend)                            │     │
│    │                                                                  │     │
│    │    ┌─────────────────────────────────────────────────────┐     │     │
│    │    │              FastAPI Application                     │     │     │
│    │    │                                                      │     │     │
│    │    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │     │     │
│    │    │  │   Feed   │ │ Articles │ │ Context  │ │  RAG   │ │     │     │
│    │    │  │  Router  │ │  Router  │ │  Router  │ │Pipeline│ │     │     │
│    │    │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │     │     │
│    │    │                                                      │     │     │
│    │    │  ┌──────────────────────────────────────────────┐  │     │     │
│    │    │  │           Ingestion Pipeline                  │  │     │     │
│    │    │  │  Scheduler → Fetcher → Dedup → NER → Enrich  │  │     │     │
│    │    │  └──────────────────────────────────────────────┘  │     │     │
│    │    └─────────────────────────────────────────────────────┘     │     │
│    │                                                                  │     │
│    └─────────────────────────────────────────────────────────────────┘     │
│                   │                    │                    │               │
│                   ▼                    ▼                    ▼               │
│    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│    │    SUPABASE      │  │    UPSTASH       │  │    PINECONE      │       │
│    │   (PostgreSQL)   │  │    (Redis)       │  │  (Vector Store)  │       │
│    │                  │  │                  │  │                  │       │
│    │ • Articles       │  │ • Context cache  │  │ • Article embeds │       │
│    │ • Entities       │  │ • LLM responses  │  │ • Similarity     │       │
│    │ • Mappings       │  │ • Rate limits    │  │   search         │       │
│    └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                              │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                      EXTERNAL APIS                               │     │
│    │                                                                  │     │
│    │    OpenAI          Wikidata          Wikipedia         RSS      │     │
│    │   (LLM +           (Facts)          (Descriptions)    Feeds     │     │
│    │   Embeddings)                                                    │     │
│    └─────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Tech Stack

### 4.1 Complete Stack Summary

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14 (App Router) | SSR capability, great DX, Vercel optimized |
| **State Management** | React Query + Context | Server state caching, minimal client state |
| **UI Components** | shadcn/ui + Tailwind | Beautiful, accessible, customizable |
| **Gestures** | react-swipeable | Mobile-friendly swipe navigation |
| **Backend** | FastAPI (Python 3.11+) | Async-first, fast, great typing |
| **Task Queue** | Redis Queue (RQ) | Simple, lightweight for MVP |
| **Primary DB** | PostgreSQL (Supabase) | Relational data, free tier |
| **Cache** | Redis (Upstash) | Context + LLM response caching |
| **Vector Store** | Pinecone | Semantic search, free tier |
| **NER** | spaCy (en_core_web_trf) | Local, accurate, free |
| **LLM** | OpenAI GPT-4o-mini / GPT-4o | Cost-effective, high quality |
| **Embeddings** | OpenAI text-embedding-3-small | Cheap, high quality |
| **Entity Linking** | Wikidata + Wikipedia APIs | Comprehensive, free |

### 4.2 Version Specifications

```yaml
# Backend
python: "3.11"
fastapi: "^0.109.0"
pydantic: "^2.5.0"
sqlalchemy: "^2.0.0"
spacy: "^3.7.0"
openai: "^1.10.0"
redis: "^5.0.0"
pinecone-client: "^3.0.0"
httpx: "^0.26.0"
apscheduler: "^3.10.0"

# Frontend
node: "20.x"
next: "14.x"
react: "18.x"
typescript: "5.x"
tailwindcss: "3.x"
@tanstack/react-query: "5.x"
react-swipeable: "7.x"
```

---

## 5. Data Ingestion Pipeline

### 5.1 Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       INGESTION PIPELINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐                                                           │
│  │  Scheduler   │  APScheduler - runs every 30 minutes                     │
│  │  (Cron)      │                                                           │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   Source     │────▶│   Fetcher    │────▶│    Dedup     │                │
│  │   Manager    │     │   Service    │     │   Service    │                │
│  │              │     │              │     │              │                │
│  │ • Load RSS   │     │ • HTTP GET   │     │ • Title      │                │
│  │   configs    │     │ • Parse XML  │     │   similarity │                │
│  │ • Get URLs   │     │ • Extract    │     │ • Content    │                │
│  │              │     │   articles   │     │   hash       │                │
│  └──────────────┘     └──────────────┘     └──────┬───────┘                │
│                                                    │                        │
│                                    duplicates ─────┘                        │
│                                    discarded       │                        │
│                                                    ▼                        │
│                                            ┌──────────────┐                 │
│                                            │   Cleaner    │                 │
│                                            │   Service    │                 │
│                                            │              │                 │
│                                            │ • Strip HTML │                 │
│                                            │ • Extract    │                 │
│                                            │   text       │                 │
│                                            └──────┬───────┘                 │
│                                                   │                         │
│         ┌─────────────────────────────────────────┼─────────────────────┐  │
│         │                                         │                      │  │
│         │              ENRICHMENT PIPELINE        │                      │  │
│         │                                         ▼                      │  │
│         │  ┌──────────────┐            ┌──────────────┐                 │  │
│         │  │     NER      │───────────▶│   Entity     │                 │  │
│         │  │   Service    │            │   Linker     │                 │  │
│         │  │              │            │              │                 │  │
│         │  │ • spaCy      │            │ • Wikidata   │                 │  │
│         │  │ • Extract    │            │ • Wikipedia  │                 │  │
│         │  │   PERSON,    │            │ • Get IDs    │                 │  │
│         │  │   ORG, etc   │            │   and URLs   │                 │  │
│         │  └──────────────┘            └──────┬───────┘                 │  │
│         │                                     │                          │  │
│         │                                     ▼                          │  │
│         │  ┌──────────────┐            ┌──────────────┐                 │  │
│         │  │  Summarizer  │            │   Embedder   │                 │  │
│         │  │   Service    │            │   Service    │                 │  │
│         │  │              │            │              │                 │  │
│         │  │ • GPT-4o-mini│            │ • OpenAI     │                 │  │
│         │  │ • 2-3 sent.  │            │   embed-3    │                 │  │
│         │  │   summary    │            │ • Store in   │                 │  │
│         │  │              │            │   Pinecone   │                 │  │
│         │  └──────┬───────┘            └──────┬───────┘                 │  │
│         │         │                           │                          │  │
│         └─────────┼───────────────────────────┼──────────────────────────┘  │
│                   │                           │                             │
│                   └─────────────┬─────────────┘                             │
│                                 │                                           │
│                                 ▼                                           │
│                          ┌──────────────┐                                   │
│                          │  Assembler   │                                   │
│                          │   Service    │                                   │
│                          │              │                                   │
│                          │ • Combine    │                                   │
│                          │   all data   │                                   │
│                          │ • Store to   │                                   │
│                          │   Postgres   │                                   │
│                          └──────────────┘                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 News Sources Configuration

```python
# RSS feeds to aggregate (curated list)
NEWS_SOURCES = [
    # Major US
    {"name": "NYT", "url": "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", "category": "general"},
    {"name": "WSJ", "url": "https://feeds.a.dj.com/rss/RSSWorldNews.xml", "category": "general"},
    {"name": "Washington Post", "url": "https://feeds.washingtonpost.com/rss/national", "category": "general"},
    
    # Tech
    {"name": "TechCrunch", "url": "https://techcrunch.com/feed/", "category": "tech"},
    {"name": "Ars Technica", "url": "https://feeds.arstechnica.com/arstechnica/index", "category": "tech"},
    {"name": "The Verge", "url": "https://www.theverge.com/rss/index.xml", "category": "tech"},
    
    # Business
    {"name": "Reuters Business", "url": "https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best", "category": "business"},
    {"name": "Bloomberg", "url": "https://feeds.bloomberg.com/markets/news.rss", "category": "business"},
    
    # Science
    {"name": "Nature", "url": "https://www.nature.com/nature.rss", "category": "science"},
    {"name": "Science Daily", "url": "https://www.sciencedaily.com/rss/all.xml", "category": "science"},
    
    # International
    {"name": "BBC", "url": "https://feeds.bbci.co.uk/news/world/rss.xml", "category": "world"},
    {"name": "Al Jazeera", "url": "https://www.aljazeera.com/xml/rss/all.xml", "category": "world"},
    {"name": "Reuters", "url": "https://www.reutersagency.com/feed/?best-topics=world-news", "category": "world"},
]
```

### 5.3 Deduplication Strategy

```python
from rapidfuzz import fuzz
from datasketch import MinHash, MinHashLSH

class DeduplicationService:
    def __init__(self):
        self.title_threshold = 85  # Fuzzy match threshold
        self.content_threshold = 0.8  # MinHash similarity threshold
        self.lsh = MinHashLSH(threshold=self.content_threshold, num_perm=128)
    
    def is_duplicate(self, article: Article, existing_articles: list[Article]) -> bool:
        # Check 1: Title similarity (fast)
        for existing in existing_articles:
            similarity = fuzz.ratio(article.title.lower(), existing.title.lower())
            if similarity >= self.title_threshold:
                return True
        
        # Check 2: Content hash (more accurate)
        article_minhash = self._compute_minhash(article.content)
        result = self.lsh.query(article_minhash)
        
        return len(result) > 0
    
    def _compute_minhash(self, content: str) -> MinHash:
        minhash = MinHash(num_perm=128)
        words = content.lower().split()
        for word in words:
            minhash.update(word.encode('utf-8'))
        return minhash
```

### 5.4 Scheduler Configuration

```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = AsyncIOScheduler()

# Main ingestion job - every 30 minutes
scheduler.add_job(
    run_ingestion_pipeline,
    trigger=IntervalTrigger(minutes=30),
    id="news_ingestion",
    name="Fetch and process news articles",
    replace_existing=True
)

# Cleanup job - daily at 3 AM
scheduler.add_job(
    cleanup_old_articles,
    trigger=CronTrigger(hour=3, minute=0),
    id="cleanup",
    name="Remove articles older than 30 days",
    replace_existing=True
)
```

---

## 6. Entity Extraction & Enrichment

### 6.1 NER Pipeline

```python
import spacy

class NERService:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_trf")
    
    def extract_entities(self, article: Article) -> list[ExtractedEntity]:
        doc = self.nlp(article.content)
        
        entities = []
        seen = set()  # Dedupe within article
        
        for ent in doc.ents:
            if ent.label_ in ["PERSON", "ORG", "GPE", "EVENT", "WORK_OF_ART", "LAW"]:
                normalized = ent.text.strip()
                if normalized.lower() not in seen:
                    seen.add(normalized.lower())
                    entities.append(ExtractedEntity(
                        text=ent.text,
                        type=self._map_entity_type(ent.label_),
                        start=ent.start_char,
                        end=ent.end_char,
                        in_title=self._is_in_title(ent.text, article.title),
                        priority=self._calculate_priority(ent, article)
                    ))
        
        return sorted(entities, key=lambda e: e.priority, reverse=True)
    
    def _map_entity_type(self, spacy_label: str) -> str:
        mapping = {
            "PERSON": "PERSON",
            "ORG": "ORG",
            "GPE": "LOCATION",
            "EVENT": "EVENT",
            "WORK_OF_ART": "CONCEPT",
            "LAW": "CONCEPT"
        }
        return mapping.get(spacy_label, "CONCEPT")
    
    def _calculate_priority(self, entity, article) -> str:
        if self._is_in_title(entity.text, article.title):
            return "high"
        elif article.content.count(entity.text) >= 3:
            return "high"
        elif article.content.count(entity.text) >= 2:
            return "medium"
        return "low"
```

### 6.2 Entity Linking

```python
import httpx

class EntityLinker:
    WIKIDATA_API = "https://www.wikidata.org/w/api.php"
    WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
    
    async def link_entity(self, entity: ExtractedEntity) -> LinkedEntity:
        # Step 1: Search Wikidata for entity
        wikidata_id = await self._search_wikidata(entity.text, entity.type)
        
        if not wikidata_id:
            return LinkedEntity(
                **entity.dict(),
                wikidata_id=None,
                wikipedia_url=None,
                description=None
            )
        
        # Step 2: Get Wikipedia URL from Wikidata
        wikipedia_url = await self._get_wikipedia_url(wikidata_id)
        
        # Step 3: Get short description from Wikipedia
        description = await self._get_wikipedia_extract(wikipedia_url)
        
        return LinkedEntity(
            **entity.dict(),
            wikidata_id=wikidata_id,
            wikipedia_url=wikipedia_url,
            description=description
        )
    
    async def _search_wikidata(self, text: str, entity_type: str) -> str | None:
        async with httpx.AsyncClient() as client:
            response = await client.get(self.WIKIDATA_API, params={
                "action": "wbsearchentities",
                "search": text,
                "language": "en",
                "format": "json",
                "limit": 1
            })
            data = response.json()
            
            if data.get("search"):
                return data["search"][0]["id"]
            return None
    
    async def _get_wikipedia_extract(self, url: str) -> str | None:
        if not url:
            return None
        
        title = url.split("/wiki/")[-1]
        
        async with httpx.AsyncClient() as client:
            response = await client.get(self.WIKIPEDIA_API, params={
                "action": "query",
                "titles": title,
                "prop": "extracts",
                "exintro": True,
                "explaintext": True,
                "format": "json"
            })
            data = response.json()
            
            pages = data.get("query", {}).get("pages", {})
            for page in pages.values():
                extract = page.get("extract", "")
                # Return first 2 sentences
                sentences = extract.split(". ")[:2]
                return ". ".join(sentences) + "." if sentences else None
            
            return None
```

---

## 7. Storage Layer

### 7.1 Database Schema (PostgreSQL)

```sql
-- =============================================
-- MINERVA DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- SOURCES TABLE
-- =============================================
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    feed_url TEXT NOT NULL UNIQUE,
    source_type VARCHAR(50) DEFAULT 'rss',
    credibility_score DECIMAL(3,2) DEFAULT 0.80,
    categories TEXT[] DEFAULT '{}',
    fetch_interval_minutes INT DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    last_fetched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ARTICLES TABLE
-- =============================================
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    
    -- Original content
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    raw_content TEXT,
    image_url TEXT,
    author VARCHAR(255),
    published_at TIMESTAMPTZ,
    
    -- Processed content
    summary TEXT,
    cleaned_content TEXT,
    reading_time_minutes INT,
    complexity_score DECIMAL(3,2),
    
    -- Metadata
    categories TEXT[] DEFAULT '{}',
    content_hash VARCHAR(64),
    
    -- Processing status
    processing_status VARCHAR(50) DEFAULT 'pending',
    processing_error TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for articles
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_status ON articles(processing_status);
CREATE INDEX idx_articles_categories ON articles USING GIN(categories);
CREATE INDEX idx_articles_content_hash ON articles(content_hash);

-- =============================================
-- ENTITIES TABLE
-- =============================================
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identity
    canonical_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    
    -- External links
    wikidata_id VARCHAR(50),
    wikipedia_url TEXT,
    image_url TEXT,
    
    -- Pre-generated context (not used in MVP - RAG on every request)
    short_context TEXT,
    context_generated_at TIMESTAMPTZ,
    
    -- Metadata
    popularity_score INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(canonical_name, entity_type)
);

-- Indexes for entities
CREATE INDEX idx_entities_wikidata ON entities(wikidata_id);
CREATE INDEX idx_entities_type ON entities(entity_type);
CREATE INDEX idx_entities_popularity ON entities(popularity_score DESC);

-- =============================================
-- ARTICLE-ENTITY MAPPING TABLE
-- =============================================
CREATE TABLE article_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    -- Position info for highlighting
    mention_text VARCHAR(255) NOT NULL,
    start_position INT NOT NULL,
    end_position INT NOT NULL,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'medium',
    in_title BOOLEAN DEFAULT false,
    mention_count INT DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(article_id, entity_id, start_position)
);

-- Indexes for mappings
CREATE INDEX idx_article_entities_article ON article_entities(article_id);
CREATE INDEX idx_article_entities_entity ON article_entities(entity_id);
CREATE INDEX idx_article_entities_priority ON article_entities(priority);

-- =============================================
-- USERS TABLE (for future auth)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    
    -- Preferences
    preferred_categories TEXT[] DEFAULT '{}',
    reading_level VARCHAR(20) DEFAULT 'general',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USER READING HISTORY (for future personalization)
-- =============================================
CREATE TABLE user_reading_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    
    -- Engagement signals
    read_at TIMESTAMPTZ DEFAULT NOW(),
    read_duration_seconds INT,
    scrolled_percentage DECIMAL(3,2),
    entities_clicked UUID[] DEFAULT '{}',
    
    UNIQUE(user_id, article_id)
);

CREATE INDEX idx_user_history_user ON user_reading_history(user_id);
CREATE INDEX idx_user_history_article ON user_reading_history(article_id);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 7.2 Redis Cache Structure

```python
# Cache key patterns and TTLs

CACHE_KEYS = {
    # Entity context (from RAG pipeline)
    # Key: context:entity:{entity_id}
    # TTL: 24 hours
    "entity_context": {
        "pattern": "context:entity:{entity_id}",
        "ttl": 86400,  # 24 hours
        "example": {
            "entity_id": "uuid",
            "name": "Philip Glass",
            "context": "American composer...",
            "sources": ["wikipedia", "wikidata"],
            "generated_at": "2026-02-06T10:00:00Z"
        }
    },
    
    # LLM response cache (avoid duplicate calls)
    # Key: llm:{hash(prompt)}
    # TTL: 6 hours
    "llm_response": {
        "pattern": "llm:{prompt_hash}",
        "ttl": 21600,  # 6 hours
        "example": {
            "prompt_hash": "abc123",
            "response": "Generated explanation...",
            "model": "gpt-4o-mini",
            "tokens_used": 150,
            "generated_at": "2026-02-06T10:00:00Z"
        }
    },
    
    # Rate limiting
    # Key: ratelimit:{ip}:{endpoint}
    # TTL: 1 hour (sliding window)
    "rate_limit": {
        "pattern": "ratelimit:{ip}:{endpoint}",
        "ttl": 3600,
        "type": "counter"
    }
}
```

### 7.3 Pinecone Vector Store

```python
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone
pc = Pinecone(api_key=settings.PINECONE_API_KEY)

# Create index (run once)
pc.create_index(
    name="minerva-articles",
    dimension=1536,  # OpenAI text-embedding-3-small
    metric="cosine",
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )
)

# Vector record structure
{
    "id": "article_{uuid}",
    "values": [...],  # 1536-dim embedding
    "metadata": {
        "title": "Article title",
        "source": "nytimes",
        "categories": ["arts", "culture"],
        "published_at": "2026-02-06T10:00:00Z",
        "summary": "Brief summary...",
        "entity_ids": ["entity_uuid_1", "entity_uuid_2"]
    }
}
```

---

## 8. API Layer

### 8.1 API Structure

```
/api/v1/
├── feed/
│   └── GET /                    # Get paginated feed
├── articles/
│   ├── GET /{id}               # Get article with entities
│   └── GET /{id}/reference     # Get full reference page
├── context/
│   ├── GET /{entity_id}        # Get entity context
│   └── POST /explain           # Get context with follow-up
└── search/
    └── GET /                    # Semantic search
```

### 8.2 Endpoint Specifications

#### GET /api/v1/feed

```python
# Request
GET /api/v1/feed?page=1&limit=20&category=tech

# Response 200 OK
{
    "articles": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "title": "Philip Glass Withdraws From Kennedy Center...",
            "summary": "Composer Philip Glass has withdrawn...",
            "image_url": "https://static01.nyt.com/images/...",
            "source": {
                "name": "New York Times",
                "logo_url": "https://..."
            },
            "published_at": "2026-02-06T10:00:00Z",
            "reading_time_minutes": 4,
            "categories": ["arts", "culture"],
            "entity_count": 5
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 150,
        "has_next": true
    }
}
```

#### GET /api/v1/articles/{id}

```python
# Response 200 OK
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Philip Glass Withdraws From Kennedy Center...",
    "content": "Full article text here...",
    "summary": "Composer Philip Glass has withdrawn...",
    "image_url": "https://...",
    "source": {
        "name": "New York Times",
        "url": "https://nytimes.com/...",
        "credibility_score": 0.95
    },
    "published_at": "2026-02-06T10:00:00Z",
    "reading_time_minutes": 4,
    "categories": ["arts", "culture"],
    "entities": [
        {
            "id": "660e8400-e29b-41d4-a716-446655440001",
            "text": "Philip Glass",
            "type": "PERSON",
            "start": 0,
            "end": 12,
            "priority": "high"
        },
        {
            "id": "660e8400-e29b-41d4-a716-446655440002",
            "text": "Kennedy Center",
            "type": "ORG",
            "start": 29,
            "end": 43,
            "priority": "high"
        }
    ]
}
```

#### GET /api/v1/context/{entity_id}

```python
# Response 200 OK
{
    "entity": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Philip Glass",
        "type": "PERSON",
        "wikidata_id": "Q189729",
        "wikipedia_url": "https://en.wikipedia.org/wiki/Philip_Glass"
    },
    "context": {
        "text": "American composer (b. 1937) known for minimalist music. Famous for 'Einstein on the Beach' and film scores including 'The Hours' and 'Koyaanisqatsi'. One of the most influential composers of the late 20th century.",
        "generated_at": "2026-02-06T10:15:00Z",
        "source": "rag_pipeline",
        "cached": false
    },
    "related_entities": [
        {"id": "...", "name": "Kennedy Center", "type": "ORG"},
        {"id": "...", "name": "Minimalist music", "type": "CONCEPT"}
    ],
    "related_articles": [
        {"id": "...", "title": "Kennedy Center Faces Budget Cuts..."}
    ]
}
```

#### POST /api/v1/context/explain

```python
# Request
{
    "entity_id": "660e8400-e29b-41d4-a716-446655440001",
    "article_id": "550e8400-e29b-41d4-a716-446655440000",
    "question": "Why is he withdrawing?"
}

# Response 200 OK
{
    "entity": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Philip Glass"
    },
    "explanation": "Philip Glass is withdrawing from his Kennedy Center performance as part of a broader wave of artist protests against recent federal arts funding cuts. The 89-year-old composer joins several other prominent artists in this stance, signaling growing tension between the arts community and current cultural policy.",
    "sources": [
        {"type": "article", "title": "Current article"},
        {"type": "wikipedia", "url": "https://..."},
        {"type": "related", "title": "Arts Funding Under Threat"}
    ],
    "confidence": 0.92
}
```

#### GET /api/v1/articles/{id}/reference

```python
# Response 200 OK
{
    "article": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Philip Glass Withdraws...",
        "summary": "..."
    },
    "entities": [
        {
            "id": "660e8400-e29b-41d4-a716-446655440001",
            "name": "Philip Glass",
            "type": "PERSON",
            "context": "American composer (b. 1937) known for minimalist music...",
            "wikipedia_url": "https://...",
            "image_url": "https://..."
        },
        {
            "id": "660e8400-e29b-41d4-a716-446655440002",
            "name": "Kennedy Center",
            "type": "ORG",
            "context": "Performing arts center in Washington D.C., opened 1971...",
            "wikipedia_url": "https://...",
            "image_url": "https://..."
        }
    ],
    "related_articles": [
        {
            "id": "...",
            "title": "Federal Arts Funding Under Threat",
            "source": "Washington Post",
            "published_at": "2026-02-05T..."
        }
    ]
}
```

### 8.3 Error Responses

```python
# 400 Bad Request
{
    "error": "bad_request",
    "message": "Invalid entity_id format",
    "details": {"field": "entity_id", "issue": "Must be valid UUID"}
}

# 404 Not Found
{
    "error": "not_found",
    "message": "Article not found",
    "details": {"article_id": "..."}
}

# 429 Too Many Requests
{
    "error": "rate_limit_exceeded",
    "message": "Context request limit exceeded",
    "details": {
        "limit": 50,
        "window": "1 hour",
        "retry_after": 1823
    }
}

# 500 Internal Server Error
{
    "error": "internal_error",
    "message": "Failed to generate context",
    "request_id": "req_abc123"
}
```

### 8.4 Response Time Targets

| Endpoint | Target p50 | Target p95 |
|----------|------------|------------|
| GET /feed | <100ms | <300ms |
| GET /articles/{id} | <150ms | <400ms |
| GET /context/{entity_id} | <800ms | <2000ms |
| POST /context/explain | <1500ms | <3000ms |
| GET /articles/{id}/reference | <1000ms | <2500ms |

---

## 9. RAG & LLM Orchestration

### 9.1 Context Generation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTEXT GENERATION PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User taps entity                                                           │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────┐                                                        │
│  │  Check Redis    │                                                        │
│  │  Cache          │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│      ┌────┴────┐                                                            │
│      │         │                                                             │
│    HIT       MISS                                                           │
│      │         │                                                             │
│      ▼         ▼                                                             │
│  ┌───────┐  ┌─────────────────────────────────────────────────────────┐    │
│  │Return │  │              RAG PIPELINE                                │    │
│  │cached │  │                                                          │    │
│  └───────┘  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│             │  │   Wikidata  │  │  Wikipedia  │  │  Pinecone   │     │    │
│             │  │   Lookup    │  │   Extract   │  │   Search    │     │    │
│             │  │             │  │             │  │             │     │    │
│             │  │ • Facts     │  │ • 2 para-   │  │ • Related   │     │    │
│             │  │ • Dates     │  │   graphs    │  │   articles  │     │    │
│             │  │ • Relations │  │ • Bio       │  │ • Similar   │     │    │
│             │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │    │
│             │         │                │                │            │    │
│             │         └────────────────┴────────────────┘            │    │
│             │                          │                              │    │
│             │                          ▼                              │    │
│             │                 ┌─────────────────┐                     │    │
│             │                 │  Build Prompt   │                     │    │
│             │                 │                 │                     │    │
│             │                 │ • Entity info   │                     │    │
│             │                 │ • Article ctx   │                     │    │
│             │                 │ • Retrieved KB  │                     │    │
│             │                 └────────┬────────┘                     │    │
│             │                          │                              │    │
│             │                          ▼                              │    │
│             │                 ┌─────────────────┐                     │    │
│             │                 │   Call LLM      │                     │    │
│             │                 │                 │                     │    │
│             │                 │ GPT-4o-mini     │                     │    │
│             │                 │ (or GPT-4o for  │                     │    │
│             │                 │  complex Q&A)   │                     │    │
│             │                 └────────┬────────┘                     │    │
│             │                          │                              │    │
│             │                          ▼                              │    │
│             │                 ┌─────────────────┐                     │    │
│             │                 │ Cache + Return  │                     │    │
│             │                 │                 │                     │    │
│             │                 │ • Redis (24hr)  │                     │    │
│             │                 │ • Return to UI  │                     │    │
│             │                 └─────────────────┘                     │    │
│             │                                                          │    │
│             └──────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Prompt Templates

```python
# prompts.py - Version controlled prompts

PROMPTS = {
    "entity_context": {
        "v1": {
            "active": True,
            "model": "gpt-4o-mini",
            "template": """You are Minerva, an AI that helps news readers understand unfamiliar terms.

ENTITY TO EXPLAIN: {entity_name}
ENTITY TYPE: {entity_type}

CONTEXT FROM ARTICLE:
"{article_excerpt}"

BACKGROUND INFORMATION:
{wikidata_facts}

{wikipedia_excerpt}

RELATED RECENT NEWS:
{related_articles_summaries}

---

Write a 2-3 sentence explanation of "{entity_name}" that helps the reader understand the news article.

RULES:
1. Focus on WHY this entity matters to the current news story
2. Include only essential background (not a full biography)
3. Use simple language accessible to a general audience
4. If the entity is controversial, remain neutral
5. Prioritize recent/relevant information over historical details

EXPLANATION:"""
        }
    },
    
    "followup_question": {
        "v1": {
            "active": True,
            "model": "gpt-4o",
            "template": """You are Minerva, an AI assistant helping a news reader understand an article.

ARTICLE TITLE: {article_title}
ARTICLE SUMMARY: {article_summary}

ENTITY BEING DISCUSSED: {entity_name}
BASIC CONTEXT: {entity_context}

USER'S QUESTION: "{user_question}"

ADDITIONAL KNOWLEDGE:
{retrieved_knowledge}

---

Answer the user's question directly and concisely.

RULES:
1. Stay focused on the question - don't add unrequested information
2. If you're not certain, say so
3. If the question is outside the scope of the article/entity, briefly explain why
4. Keep the answer under 100 words unless complexity requires more
5. Do not make up facts - only use provided information

ANSWER:"""
        }
    }
}
```

### 9.3 LLM Service

```python
from openai import AsyncOpenAI

class LLMService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.cache = RedisCache()
    
    async def generate_context(
        self,
        entity: Entity,
        article: Article,
        retrieved_knowledge: dict
    ) -> ContextResponse:
        # Check cache first
        cache_key = f"context:entity:{entity.id}"
        cached = await self.cache.get(cache_key)
        if cached:
            return ContextResponse(**cached, cached=True)
        
        # Build prompt
        prompt = self._build_prompt(
            template=PROMPTS["entity_context"]["v1"]["template"],
            entity=entity,
            article=article,
            knowledge=retrieved_knowledge
        )
        
        # Call LLM
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.3
        )
        
        context_text = response.choices[0].message.content
        
        # Cache response
        result = ContextResponse(
            entity_id=entity.id,
            text=context_text,
            generated_at=datetime.utcnow(),
            cached=False
        )
        await self.cache.set(cache_key, result.dict(), ttl=86400)
        
        return result
    
    async def answer_followup(
        self,
        entity: Entity,
        article: Article,
        question: str,
        retrieved_knowledge: dict
    ) -> str:
        # Follow-ups use GPT-4o for better reasoning
        prompt = self._build_prompt(
            template=PROMPTS["followup_question"]["v1"]["template"],
            entity=entity,
            article=article,
            knowledge=retrieved_knowledge,
            question=question
        )
        
        response = await self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.4
        )
        
        return response.choices[0].message.content
```

### 9.4 Rate Limiting

```python
RATE_LIMITS = {
    "context_requests": {
        "limit": 50,
        "window_seconds": 3600,  # 1 hour
    },
    "followup_questions": {
        "limit": 20,
        "window_seconds": 3600,
    },
    "reference_pages": {
        "limit": 30,
        "window_seconds": 3600,
    }
}

class RateLimiter:
    def __init__(self, redis: Redis):
        self.redis = redis
    
    async def check_limit(
        self,
        identifier: str,  # IP or user ID
        limit_type: str
    ) -> tuple[bool, int]:
        """
        Returns (is_allowed, remaining_requests)
        """
        config = RATE_LIMITS[limit_type]
        key = f"ratelimit:{identifier}:{limit_type}"
        
        current = await self.redis.incr(key)
        
        if current == 1:
            await self.redis.expire(key, config["window_seconds"])
        
        remaining = max(0, config["limit"] - current)
        is_allowed = current <= config["limit"]
        
        return is_allowed, remaining
```

---

## 10. Frontend Architecture

### 10.1 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Feed (home)
│   │   ├── article/
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Article view
│   │   │       └── reference/
│   │   │           └── page.tsx      # Reference page
│   │   └── search/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── feed/
│   │   │   ├── FeedList.tsx
│   │   │   ├── ArticleCard.tsx
│   │   │   └── CategoryTabs.tsx
│   │   │
│   │   ├── article/
│   │   │   ├── ArticleView.tsx
│   │   │   ├── ArticleHeader.tsx
│   │   │   ├── ArticleContent.tsx
│   │   │   ├── HighlightedText.tsx
│   │   │   └── EntityHighlight.tsx
│   │   │
│   │   ├── context/
│   │   │   ├── ContextPopup.tsx
│   │   │   ├── ContextCard.tsx
│   │   │   └── FollowupInput.tsx
│   │   │
│   │   └── reference/
│   │       ├── ReferencePage.tsx
│   │       ├── EntityList.tsx
│   │       └── RelatedArticles.tsx
│   │
│   ├── hooks/
│   │   ├── useFeed.ts
│   │   ├── useArticle.ts
│   │   ├── useEntityContext.ts
│   │   ├── useReferencePage.ts
│   │   └── usePrefetch.ts
│   │
│   ├── lib/
│   │   ├── api.ts                    # API client
│   │   ├── queryClient.ts            # React Query config
│   │   └── utils.ts
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   │
│   └── styles/
│       └── globals.css               # Tailwind imports
│
├── public/
│   └── favicon.ico
│
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── components.json                   # shadcn/ui config
```

### 10.2 Key Components

#### HighlightedText.tsx

```tsx
import { Entity } from '@/types';
import { EntityHighlight } from './EntityHighlight';

interface Props {
  content: string;
  entities: Entity[];
  onEntityTap: (entity: Entity) => void;
}

export function HighlightedText({ content, entities, onEntityTap }: Props) {
  // Sort entities by position (descending to avoid offset issues)
  const sorted = [...entities].sort((a, b) => b.start - a.start);
  
  // Build segments
  const segments: Array<{ text: string; entity?: Entity }> = [];
  let lastEnd = content.length;
  
  for (const entity of sorted) {
    // Text after entity
    if (entity.end < lastEnd) {
      segments.unshift({ text: content.slice(entity.end, lastEnd) });
    }
    // Entity itself
    segments.unshift({
      text: content.slice(entity.start, entity.end),
      entity
    });
    lastEnd = entity.start;
  }
  
  // Text before first entity
  if (lastEnd > 0) {
    segments.unshift({ text: content.slice(0, lastEnd) });
  }
  
  return (
    <p className="text-lg leading-relaxed">
      {segments.map((segment, i) =>
        segment.entity ? (
          <EntityHighlight
            key={i}
            entity={segment.entity}
            text={segment.text}
            onTap={() => onEntityTap(segment.entity!)}
          />
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </p>
  );
}
```

#### ContextPopup.tsx

```tsx
import { useEntityContext } from '@/hooks/useEntityContext';
import { Entity } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, MessageCircle } from 'lucide-react';

interface Props {
  entity: Entity;
  onClose: () => void;
  onFollowup: () => void;
}

export function ContextPopup({ entity, onClose, onFollowup }: Props) {
  const { data, isLoading, error } = useEntityContext(entity.id);
  
  return (
    <Card className="w-80 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EntityIcon type={entity.type} />
            <div>
              <h3 className="font-semibold">{entity.text}</h3>
              <span className="text-xs text-muted-foreground uppercase">
                {entity.type}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        
        {error && (
          <p className="text-sm text-destructive">
            Failed to load context. Tap to retry.
          </p>
        )}
        
        {data && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {data.context.text}
            </p>
            
            <div className="flex gap-2">
              {data.entity.wikipedia_url && (
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={data.entity.wikipedia_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Wikipedia
                  </a>
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={onFollowup}>
                <MessageCircle className="h-4 w-4 mr-1" />
                Ask More
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

### 10.3 React Query Hooks

```typescript
// hooks/useEntityContext.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useEntityContext(entityId: string) {
  return useQuery({
    queryKey: ['context', entityId],
    queryFn: () => api.getEntityContext(entityId),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// hooks/usePrefetch.ts
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '@/lib/api';

export function usePrefetch(articleId: string, nextArticleId?: string) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Prefetch reference page for current article
    queryClient.prefetchQuery({
      queryKey: ['reference', articleId],
      queryFn: () => api.getReferencePage(articleId),
    });
    
    // Prefetch next article if available
    if (nextArticleId) {
      queryClient.prefetchQuery({
        queryKey: ['article', nextArticleId],
        queryFn: () => api.getArticle(nextArticleId),
      });
    }
  }, [articleId, nextArticleId, queryClient]);
}
```

### 10.4 Swipe Navigation

```tsx
// components/article/ArticleView.tsx
import { useSwipeable } from 'react-swipeable';
import { useRouter } from 'next/navigation';

export function ArticleView({ article, nextArticleId }) {
  const router = useRouter();
  
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      router.push(`/article/${article.id}/reference`);
    },
    onSwipedRight: () => {
      router.push('/');
    },
    onSwipedUp: () => {
      if (nextArticleId) {
        router.push(`/article/${nextArticleId}`);
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
  });
  
  // Prefetch next article and reference page
  usePrefetch(article.id, nextArticleId);
  
  return (
    <div {...handlers} className="min-h-screen">
      <ArticleHeader article={article} />
      <ArticleContent article={article} />
      
      {/* Swipe hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
        ← Swipe for context
      </div>
    </div>
  );
}
```

---

## 11. Infrastructure & Deployment

### 11.1 Service Configuration

| Service | Provider | Plan | Purpose |
|---------|----------|------|---------|
| Frontend | Vercel | Free | Next.js hosting, CDN |
| Backend | Railway | Free ($5 credit) | FastAPI, background jobs |
| Database | Supabase | Free (500MB) | PostgreSQL |
| Cache | Upstash | Free (10K/day) | Redis |
| Vectors | Pinecone | Starter (free) | Embeddings search |
| Monitoring | Sentry | Free | Error tracking |

### 11.2 Environment Variables

```bash
# Backend (.env)
# ============ DATABASE ============
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx

# ============ CACHE ============
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=xxx

# ============ VECTOR STORE ============
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX=minerva-articles

# ============ LLM ============
OPENAI_API_KEY=sk-xxx

# ============ MONITORING ============
SENTRY_DSN=https://xxx@sentry.io/xxx

# ============ APP CONFIG ============
ENVIRONMENT=production
LOG_LEVEL=INFO

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://minerva-api.railway.app
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 11.3 Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install poetry
          poetry install
      
      - name: Run tests
        run: |
          cd backend
          poetry run pytest
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: minerva-api

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install and build
        run: |
          cd frontend
          npm ci
          npm run build
      
      # Vercel auto-deploys from GitHub
```

### 11.4 Local Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: minerva
      POSTGRES_PASSWORD: minerva_dev
      POSTGRES_DB: minerva
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

```bash
# Quick start
docker-compose up -d

# Backend
cd backend
poetry install
poetry run uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

---

## 12. Cost Analysis

### 12.1 Monthly Cost Breakdown (MVP)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Free | $0 |
| Railway | Free ($5 credit) | $0 |
| Supabase | Free (500MB) | $0 |
| Upstash | Free (10K/day) | $0 |
| Pinecone | Starter | $0 |
| Sentry | Free | $0 |
| OpenAI API | Pay as you go | ~$17 |
| **Total** | | **~$17/month** |

### 12.2 OpenAI Cost Breakdown

Assuming 100 articles/day, 100 users:

| Task | Model | Est. Tokens/Call | Calls/Day | Daily Cost |
|------|-------|------------------|-----------|------------|
| Summaries | GPT-4o-mini | 500 | 100 | $0.03 |
| Context (cache miss ~40%) | GPT-4o-mini | 800 | 200 | $0.10 |
| Follow-ups | GPT-4o | 1000 | 50 | $0.25 |
| Embeddings | text-embedding-3-small | 500 | 100 | $0.001 |
| **Daily Total** | | | | **~$0.38** |
| **Monthly Total** | | | | **~$11.50** |

Buffer for growth: ~$17/month

---

## 13. Development Roadmap

### 13.1 MVP Phases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT ROADMAP                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: Foundation (Week 1-2)                                             │
│  ─────────────────────────────────                                          │
│  □ Set up project structure (backend + frontend)                            │
│  □ Configure Supabase (database + schema)                                   │
│  □ Configure Upstash (Redis)                                                │
│  □ Configure Pinecone (vector store)                                        │
│  □ Implement basic ingestion pipeline (RSS → DB)                            │
│  □ Deploy skeleton to Railway + Vercel                                      │
│                                                                              │
│  PHASE 2: Core Pipeline (Week 3-4)                                          │
│  ───────────────────────────────────                                        │
│  □ Implement NER with spaCy                                                 │
│  □ Implement entity linking (Wikidata + Wikipedia)                          │
│  □ Implement summarization (GPT-4o-mini)                                    │
│  □ Implement embedding generation                                           │
│  □ Full ingestion pipeline working end-to-end                               │
│                                                                              │
│  PHASE 3: API Layer (Week 5-6)                                              │
│  ──────────────────────────────                                             │
│  □ Implement /feed endpoint                                                 │
│  □ Implement /articles/{id} endpoint                                        │
│  □ Implement /context/{entity_id} endpoint (RAG pipeline)                   │
│  □ Implement /articles/{id}/reference endpoint                              │
│  □ Add Redis caching                                                        │
│  □ Add rate limiting                                                        │
│                                                                              │
│  PHASE 4: Frontend (Week 7-8)                                               │
│  ──────────────────────────────                                             │
│  □ Feed page with article cards                                             │
│  □ Article view with entity highlighting                                    │
│  □ Context popup (tap entity)                                               │
│  □ Reference page (swipe left)                                              │
│  □ Swipe navigation                                                         │
│  □ Prefetching                                                              │
│                                                                              │
│  PHASE 5: Polish & Launch (Week 9-10)                                       │
│  ─────────────────────────────────────                                      │
│  □ Error handling and edge cases                                            │
│  □ Loading states and animations                                            │
│  □ Mobile responsiveness testing                                            │
│  □ Performance optimization                                                 │
│  □ Sentry integration                                                       │
│  □ Beta user testing                                                        │
│  □ Launch MVP 🚀                                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 13.2 Post-MVP Features

| Feature | Priority | Effort |
|---------|----------|--------|
| User authentication | P1 | Medium |
| Personalized feed | P1 | High |
| Follow-up Q&A | P1 | Medium |
| Story timeline | P2 | Medium |
| Save/bookmark articles | P2 | Low |
| Push notifications | P2 | Medium |
| Native mobile app | P3 | High |
| Publisher partnerships | P3 | High |

---

## Appendix A: Quick Reference

### A.1 Key Commands

```bash
# Start local development
docker-compose up -d
cd backend && poetry run uvicorn app.main:app --reload
cd frontend && npm run dev

# Run tests
cd backend && poetry run pytest
cd frontend && npm test

# Database migrations
cd backend && poetry run alembic upgrade head

# Deploy
git push origin main  # Auto-deploys via CI/CD
```

### A.2 API Quick Reference

```
GET  /api/v1/feed                    # Get article feed
GET  /api/v1/articles/{id}           # Get article with entities
GET  /api/v1/context/{entity_id}     # Get entity context
POST /api/v1/context/explain         # Follow-up question
GET  /api/v1/articles/{id}/reference # Full reference page
```

### A.3 Key Files

```
backend/app/main.py                  # FastAPI entry point
backend/app/services/context_service.py  # RAG pipeline
backend/app/ingestion/scheduler.py   # Ingestion jobs
frontend/src/app/page.tsx            # Feed page
frontend/src/components/context/ContextPopup.tsx  # Core UX
```

---

*Document Version: 1.0*
*Created: February 2026*
*Status: Ready for Development*
