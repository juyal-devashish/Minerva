import json
from typing import Any

import redis.asyncio as redis

from app.config import settings


class CacheService:
    """Redis cache for entity contexts and LLM responses."""

    def __init__(self) -> None:
        self.redis = redis.from_url(settings.redis_url, decode_responses=True)

    async def get(self, key: str) -> dict | None:
        """Get a cached value by key."""
        value = await self.redis.get(key)
        if value:
            return json.loads(value)
        return None

    async def set(self, key: str, value: Any, ttl: int | None = None) -> None:
        """Set a cached value with optional TTL in seconds."""
        serialized = json.dumps(value, default=str)
        if ttl:
            await self.redis.setex(key, ttl, serialized)
        else:
            await self.redis.set(key, serialized)

    async def delete(self, key: str) -> None:
        """Delete a cached value."""
        await self.redis.delete(key)

    async def close(self) -> None:
        """Close the Redis connection."""
        await self.redis.close()
