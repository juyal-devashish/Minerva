from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

engine = create_async_engine(
    settings.database_url,
    echo=(settings.environment == "development"),
    # SQLite needs this for async
    **({} if "postgresql" in settings.database_url else {"connect_args": {"check_same_thread": False}}),
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

IS_SQLITE = "sqlite" in settings.database_url


class Base(DeclarativeBase):
    pass


async def create_tables() -> None:
    """Create all tables (used in dev with SQLite)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncIterator[AsyncSession]:
    """FastAPI dependency that provides a database session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
