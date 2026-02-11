from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    environment: str = "development"
    log_level: str = "INFO"
    backend_port: int = 8000
    cors_origins: list[str] = ["http://localhost:3000"]

    # Database
    database_url: str = "postgresql+asyncpg://minerva:minerva_dev@localhost:5432/minerva"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Pinecone
    pinecone_api_key: str = ""
    pinecone_environment: str = "us-east-1"
    pinecone_index: str = "minerva-articles"

    # OpenAI
    openai_api_key: str = ""

    # Sentry
    sentry_dsn: str = ""

    # Cache TTLs (seconds)
    entity_context_ttl: int = 86400  # 24 hours
    llm_response_ttl: int = 21600  # 6 hours

    # Rate limits
    context_rate_limit: int = 50
    followup_rate_limit: int = 20
    rate_limit_window: int = 3600  # 1 hour

    model_config = {"env_file": ("../.env", ".env"), "env_file_encoding": "utf-8"}


settings = Settings()
