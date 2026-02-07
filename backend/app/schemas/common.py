from pydantic import BaseModel


class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    has_next: bool


class ErrorResponse(BaseModel):
    error: str
    message: str
    details: dict | None = None
