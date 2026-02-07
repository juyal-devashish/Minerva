import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.article import Article
from app.models.entity import ArticleEntity, Entity
from app.models.source import Source
from app.schemas.article import (
    ArticleDetail,
    EntityInArticle,
    ReferenceEntityContext,
    ReferenceResponse,
    RelatedArticle,
    SourceInfo,
)

router = APIRouter()


@router.get("/{article_id}", response_model=ArticleDetail)
async def get_article(
    article_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> ArticleDetail:
    """Get article with its entities for highlighting."""
    result = await db.execute(
        select(Article, Source)
        .join(Source, Article.source_id == Source.id, isouter=True)
        .where(Article.id == article_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Article not found")

    article, source = row

    # Get entities
    entity_results = await db.execute(
        select(ArticleEntity, Entity)
        .join(Entity, ArticleEntity.entity_id == Entity.id)
        .where(ArticleEntity.article_id == article_id)
        .order_by(ArticleEntity.start_position)
    )

    entities = [
        EntityInArticle(
            id=entity.id,
            text=ae.mention_text,
            type=entity.entity_type,
            start=ae.start_position,
            end=ae.end_position,
            priority=ae.priority,
        )
        for ae, entity in entity_results.all()
    ]

    return ArticleDetail(
        id=article.id,
        title=article.title,
        content=article.cleaned_content or article.raw_content,
        summary=article.summary,
        image_url=article.image_url,
        source=SourceInfo(
            name=source.name if source else "Unknown",
            url=article.url,
            credibility_score=float(source.credibility_score) if source else None,
        ),
        published_at=article.published_at,
        reading_time_minutes=article.reading_time_minutes,
        categories=article.categories or [],
        entities=entities,
    )


@router.get("/{article_id}/reference", response_model=ReferenceResponse)
async def get_reference_page(
    article_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> ReferenceResponse:
    """Get full reference page with all entity contexts and related articles."""
    # Get article
    article_detail = await get_article(article_id, db)

    # Get entity contexts
    entity_results = await db.execute(
        select(Entity)
        .join(ArticleEntity, ArticleEntity.entity_id == Entity.id)
        .where(ArticleEntity.article_id == article_id)
        .order_by(Entity.popularity_score.desc())
    )

    entities = [
        ReferenceEntityContext(
            id=entity.id,
            name=entity.canonical_name,
            type=entity.entity_type,
            context=entity.short_context,
            wikipedia_url=entity.wikipedia_url,
            image_url=entity.image_url,
        )
        for entity in entity_results.scalars().all()
    ]

    # TODO: Implement semantic similarity search for related articles
    related_articles: list[RelatedArticle] = []

    return ReferenceResponse(
        article=article_detail,
        entities=entities,
        related_articles=related_articles,
    )
