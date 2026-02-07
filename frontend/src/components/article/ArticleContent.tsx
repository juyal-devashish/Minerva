"use client";

import { HighlightedText } from "./HighlightedText";
import type { ArticleDetail, EntityInArticle } from "@/types";

interface Props {
  article: ArticleDetail;
  onEntityTap: (entity: EntityInArticle) => void;
}

export function ArticleContent({ article, onEntityTap }: Props) {
  if (!article.content) {
    return <p className="text-muted-foreground">No content available.</p>;
  }

  return (
    <article className="prose prose-slate max-w-none">
      <HighlightedText
        content={article.content}
        entities={article.entities}
        onEntityTap={onEntityTap}
      />
    </article>
  );
}
