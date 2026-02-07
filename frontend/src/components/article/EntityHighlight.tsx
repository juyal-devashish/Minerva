"use client";

import type { EntityInArticle } from "@/types";

interface Props {
  entity: EntityInArticle;
  text: string;
  onTap: () => void;
}

export function EntityHighlight({ entity, text, onTap }: Props) {
  const priorityStyles = {
    high: "bg-primary/10 border-b-2 border-primary/40",
    medium: "bg-secondary border-b border-secondary-foreground/20",
    low: "border-b border-dashed border-muted-foreground/30",
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onTap}
      onKeyDown={(e) => e.key === "Enter" && onTap()}
      className={`cursor-pointer rounded-sm px-0.5 transition-colors hover:bg-primary/20 ${
        priorityStyles[entity.priority as keyof typeof priorityStyles] ||
        priorityStyles.low
      }`}
    >
      {text}
    </span>
  );
}
