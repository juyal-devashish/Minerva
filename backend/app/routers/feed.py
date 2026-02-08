from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import IS_SQLITE, get_db
from app.models.article import Article
from app.models.entity import ArticleEntity
from app.models.source import Source
from app.schemas.common import PaginationMeta
from app.schemas.feed import ArticleCard, ArticleCardSource, FeedResponse

router = APIRouter()


@router.get("", response_model=FeedResponse)
async def get_feed(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
) -> FeedResponse:
    """Get paginated article feed."""
    query = (
        select(Article, Source)
        .join(Source, Article.source_id == Source.id, isouter=True)
        .where(Article.processing_status == "completed")
        .order_by(Article.published_at.desc())
    )

    if category:
        if IS_SQLITE:
            # JSON array stored as text in SQLite — use json_each or LIKE
            query = query.where(
                text("EXISTS (SELECT 1 FROM json_each(articles.categories) WHERE json_each.value = :cat)")
            ).params(cat=category)
        else:
            query = query.where(Article.categories.contains([category]))

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    # Paginate
    query = query.offset((page - 1) * limit).limit(limit)
    results = (await db.execute(query)).all()

    articles = []
    for article, source in results:
        # Count entities for this article
        entity_count_q = select(func.count()).where(ArticleEntity.article_id == article.id)
        entity_count = (await db.execute(entity_count_q)).scalar_one()

        articles.append(
            ArticleCard(
                id=article.id,
                title=article.title,
                summary=article.summary,
                image_url=article.image_url,
                source=ArticleCardSource(name=source.name if source else "Unknown"),
                published_at=article.published_at,
                reading_time_minutes=article.reading_time_minutes,
                categories=article.categories or [],
                entity_count=entity_count,
            )
        )

    return FeedResponse(
        articles=articles,
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            has_next=(page * limit) < total,
        ),
    )
