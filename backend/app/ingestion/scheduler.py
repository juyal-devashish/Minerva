import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from app.ingestion.pipeline import IngestionPipeline

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def run_ingestion_pipeline() -> None:
    """Run the news ingestion pipeline."""
    logger.info("Scheduled ingestion pipeline starting")
    pipeline = IngestionPipeline()
    count = await pipeline.run()
    logger.info(f"Scheduled ingestion complete: {count} articles processed")


async def cleanup_old_articles() -> None:
    """Remove articles older than 30 days."""
    # TODO: Implement cleanup logic
    logger.info("Running article cleanup job")


def setup_scheduler() -> None:
    """Configure and start the scheduler."""
    # Main ingestion job - every 30 minutes
    scheduler.add_job(
        run_ingestion_pipeline,
        trigger=IntervalTrigger(minutes=30),
        id="news_ingestion",
        name="Fetch and process news articles",
        replace_existing=True,
    )

    # Cleanup job - daily at 3 AM
    scheduler.add_job(
        cleanup_old_articles,
        trigger=CronTrigger(hour=3, minute=0),
        id="cleanup",
        name="Remove articles older than 30 days",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("Scheduler started")
