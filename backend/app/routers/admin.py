import logging

from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, status
from pydantic import BaseModel

from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


class AdminResponse(BaseModel):
    message: str
    status: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


async def _run_pipeline() -> None:
    """Background task: run the ingestion pipeline."""
    try:
        from app.ingestion.pipeline import IngestionPipeline

        pipeline = IngestionPipeline()
        count = await pipeline.run()
        logger.info(f"Pipeline triggered via API completed. Processed {count} articles.")
    except Exception:
        logger.error("Pipeline triggered via API failed.", exc_info=True)


def _check_secret(secret: str) -> None:
    if secret != settings.admin_secret:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid admin secret.")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post(
    "/pipeline/run",
    response_model=AdminResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def trigger_pipeline(
    background_tasks: BackgroundTasks,
    x_admin_secret: str = Header(..., alias="X-Admin-Secret"),
) -> AdminResponse:
    """Trigger the ingestion pipeline manually.

    Returns 202 immediately; pipeline runs in the background.
    """
    _check_secret(x_admin_secret)
    background_tasks.add_task(_run_pipeline)
    return AdminResponse(message="Pipeline started in the background.", status="accepted")


@router.post(
    "/seed",
    response_model=AdminResponse,
    status_code=status.HTTP_200_OK,
)
async def seed_database(
    x_admin_secret: str = Header(..., alias="X-Admin-Secret"),
) -> AdminResponse:
    """Seed the database with sample articles and entities.

    No-ops if the database already contains articles.
    """
    _check_secret(x_admin_secret)

    from app.database import create_tables
    from app.seed import seed

    await create_tables()
    await seed()
    return AdminResponse(message="Seed complete (skipped if data already existed).", status="ok")
