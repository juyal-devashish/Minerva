import uuid
from datetime import datetime

from pydantic import BaseModel


class SourceInfo(BaseModel):
    name: str
    url: str | None = None
    credibility_score: float | None = None


class EntityInArticle(BaseModel):
    id: uuid.UUID
    text: str
    type: str
    start: int
    end: int
    priority: str = "medium"


class ArticleDetail(BaseModel):
    id: uuid.UUID
    title: str
    content: str | None = None
    summary: str | None = None
    image_url: str | None = None
    source: SourceInfo
    published_at: datetime | None = None
    reading_time_minutes: int | None = None
    categories: list[str] = []
    entities: list[EntityInArticle] = []


class ReferenceEntityContext(BaseModel):
    id: uuid.UUID
    name: str
    type: str
    context: str | None = None
    wikipedia_url: str | None = None
    image_url: str | None = None


class RelatedArticle(BaseModel):
    id: uuid.UUID
    title: str
    source: str
    published_at: datetime | None = None


class ReferenceResponse(BaseModel):
    article: ArticleDetail
    entities: list[ReferenceEntityContext] = []
    related_articles: list[RelatedArticle] = []
