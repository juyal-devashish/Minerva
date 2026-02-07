from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import articles, context, feed, search


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Manage application startup and shutdown."""
    # Startup
    if settings.sentry_dsn:
        sentry_sdk.init(dsn=settings.sentry_dsn, environment=settings.environment)

    # Create tables for SQLite (no Alembic needed locally)
    from app.database import IS_SQLITE, create_tables

    if IS_SQLITE:
        await create_tables()

    yield
    # Shutdown


app = FastAPI(
    title="Minerva API",
    description="AI-powered contextual news intelligence platform",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(feed.router, prefix="/api/v1/feed", tags=["feed"])
app.include_router(articles.router, prefix="/api/v1/articles", tags=["articles"])
app.include_router(context.router, prefix="/api/v1/context", tags=["context"])
app.include_router(search.router, prefix="/api/v1/search", tags=["search"])


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
