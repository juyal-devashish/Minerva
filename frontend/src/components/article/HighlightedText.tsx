"use client";

import { EntityHighlight } from "./EntityHighlight";
import type { EntityInArticle } from "@/types";

interface Props {
  content: string;
  entities: EntityInArticle[];
  onEntityTap: (entity: EntityInArticle) => void;
}

export function HighlightedText({ content, entities, onEntityTap }: Props) {
  // Sort entities by position (descending to avoid offset issues)
  const sorted = [...entities].sort((a, b) => b.start - a.start);

  // Build segments
  const segments: Array<{ text: string; entity?: EntityInArticle }> = [];
  let lastEnd = content.length;

  for (const entity of sorted) {
    // Text after entity
    if (entity.end < lastEnd) {
      segments.unshift({ text: content.slice(entity.end, lastEnd) });
    }
    // Entity itself
    segments.unshift({
      text: content.slice(entity.start, entity.end),
      entity,
    });
    lastEnd = entity.start;
  }

  // Text before first entity
  if (lastEnd > 0) {
    segments.unshift({ text: content.slice(0, lastEnd) });
  }

  return (
    <p className="text-lg leading-relaxed">
      {segments.map((segment, i) =>
        segment.entity ? (
          <EntityHighlight
            key={i}
            entity={segment.entity}
            text={segment.text}
            onTap={() => onEntityTap(segment.entity!)}
          />
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </p>
  );
}
