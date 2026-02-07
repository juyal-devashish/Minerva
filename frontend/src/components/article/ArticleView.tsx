"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { ContextPopup } from "@/components/context/ContextPopup";
import type { ArticleDetail, EntityInArticle } from "@/types";

interface Props {
  article: ArticleDetail;
}

export function ArticleView({ article }: Props) {
  const router = useRouter();
  const [selectedEntity, setSelectedEntity] = useState<EntityInArticle | null>(
    null
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      router.push(`/article/${article.id}/reference`);
    },
    onSwipedRight: () => {
      router.push("/");
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
  });

  return (
    <div {...handlers} className="min-h-screen">
      <main className="container mx-auto max-w-2xl px-4 py-6">
        <ArticleHeader article={article} />
        <ArticleContent
          article={article}
          onEntityTap={(entity) => setSelectedEntity(entity)}
        />
      </main>

      {selectedEntity && (
        <ContextPopup
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onFollowup={() => {
            // TODO: Open follow-up input
          }}
        />
      )}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
        Swipe left for context
      </div>
    </div>
  );
}
