import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.article import Article
from app.models.entity import Entity
from app.schemas.context import (
    ContextResponse,
    ExplainRequest,
    ExplainResponse,
)
from app.services.context_service import ContextService

router = APIRouter()


def get_context_service() -> ContextService:
    return ContextService()


@router.get("/{entity_id}", response_model=ContextResponse)
async def get_entity_context(
    entity_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    service: ContextService = Depends(get_context_service),
) -> ContextResponse:
    """Get contextual explanation for an entity using the RAG pipeline."""
    entity = await db.get(Entity, entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")

    return await service.get_context(entity, db)


@router.post("/explain", response_model=ExplainResponse)
async def explain_entity(
    request: ExplainRequest,
    db: AsyncSession = Depends(get_db),
    service: ContextService = Depends(get_context_service),
) -> ExplainResponse:
    """Answer a follow-up question about an entity in the context of an article."""
    entity = await db.get(Entity, request.entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")

    article = await db.get(Article, request.article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    return await service.answer_followup(entity, article, request.question, db)
