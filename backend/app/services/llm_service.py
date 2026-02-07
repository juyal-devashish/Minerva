from openai import AsyncOpenAI

from app.config import settings
from app.services.cache_service import CacheService


class LLMService:
    """OpenAI LLM interface for context generation and follow-up answers."""

    def __init__(self) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.cache = CacheService()

    async def generate(
        self,
        prompt: str,
        model: str = "gpt-4o-mini",
        max_tokens: int = 300,
        temperature: float = 0.3,
    ) -> str:
        """Generate a completion from the LLM.

        Args:
            prompt: The prompt to send.
            model: OpenAI model name.
            max_tokens: Maximum tokens in response.
            temperature: Sampling temperature.

        Returns:
            The generated text.
        """
        response = await self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return response.choices[0].message.content or ""

    async def generate_embedding(self, text: str) -> list[float]:
        """Generate an embedding vector for text.

        Args:
            text: The text to embed.

        Returns:
            Embedding vector (1536 dimensions).
        """
        response = await self.client.embeddings.create(
            model="text-embedding-3-small",
            input=text,
        )
        return response.data[0].embedding
