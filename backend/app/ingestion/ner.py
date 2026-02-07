import logging
from dataclasses import dataclass

logger = logging.getLogger(__name__)

ENTITY_TYPE_MAP = {
    "PERSON": "PERSON",
    "ORG": "ORG",
    "GPE": "LOCATION",
    "EVENT": "EVENT",
    "WORK_OF_ART": "CONCEPT",
    "LAW": "CONCEPT",
}

ALLOWED_LABELS = set(ENTITY_TYPE_MAP.keys())


@dataclass
class ExtractedEntity:
    """An entity extracted from article text."""

    text: str
    type: str
    start: int
    end: int
    in_title: bool
    priority: str


class NERService:
    """Named Entity Recognition using spaCy."""

    def __init__(self) -> None:
        self._nlp = None

    @property
    def nlp(self):
        """Lazy-load spaCy model."""
        if self._nlp is None:
            import spacy
            try:
                self._nlp = spacy.load("en_core_web_trf")
            except OSError:
                logger.warning("en_core_web_trf not found, falling back to en_core_web_sm")
                self._nlp = spacy.load("en_core_web_sm")
        return self._nlp

    def extract_entities(self, content: str, title: str) -> list[ExtractedEntity]:
        """Extract named entities from article content.

        Args:
            content: Article text.
            title: Article title.

        Returns:
            List of extracted entities, sorted by priority.
        """
        doc = self.nlp(content)

        entities = []
        seen: set[str] = set()

        for ent in doc.ents:
            if ent.label_ not in ALLOWED_LABELS:
                continue

            normalized = ent.text.strip()
            if normalized.lower() in seen:
                continue

            seen.add(normalized.lower())

            in_title = normalized.lower() in title.lower()
            mention_count = content.lower().count(normalized.lower())

            if in_title or mention_count >= 3:
                priority = "high"
            elif mention_count >= 2:
                priority = "medium"
            else:
                priority = "low"

            entities.append(
                ExtractedEntity(
                    text=ent.text,
                    type=ENTITY_TYPE_MAP[ent.label_],
                    start=ent.start_char,
                    end=ent.end_char,
                    in_title=in_title,
                    priority=priority,
                )
            )

        return sorted(entities, key=lambda e: {"high": 0, "medium": 1, "low": 2}[e.priority])
