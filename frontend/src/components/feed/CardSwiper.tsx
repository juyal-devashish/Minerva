"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFeed } from "@/hooks/useFeed";
import { useArticle } from "@/hooks/useArticle";
import { FullPageCard } from "./FullPageCard";
import { ContextPopup } from "@/components/context/ContextPopup";
import type { ArticleCard, EntityInArticle } from "@/types";

/** Wrapper that fetches article detail (entities) for a card */
function CardWithEntities({
  article,
  isVisible,
  onArticleClick,
  onEntityTap,
}: {
  article: ArticleCard;
  isVisible: boolean;
  onArticleClick: (id: string) => void;
  onEntityTap: (entity: EntityInArticle, articleId: string) => void;
}) {
  // Only fetch detail when card is visible or near-visible
  const { data } = useArticle(isVisible ? article.id : "");
  const entities = data?.entities ?? [];

  return (
    <FullPageCard
      article={article}
      entities={entities}
      onClick={() => onArticleClick(article.id)}
      onEntityTap={(entity) => onEntityTap(entity, article.id)}
    />
  );
}

interface CardSwiperProps {
  category?: string;
  onArticleClick: (articleId: string) => void;
}

export function CardSwiper({ category, onArticleClick }: CardSwiperProps) {
  const router = useRouter();
  const { data, isLoading, error } = useFeed({ category });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<{ entity: EntityInArticle; articleId: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const articles = data?.articles ?? [];

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [category]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cardHeight = container.clientHeight;
    if (cardHeight === 0) return;
    const scrollTop = container.scrollTop;
    const newIndex = Math.round(scrollTop / cardHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < articles.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, articles.length]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: "var(--background)" }}>
        <div className="flex-1 flex flex-col">
          {/* Image skeleton */}
          <div
            className="flex-shrink-0 animate-pulse"
            style={{ height: "35%", backgroundColor: "var(--background-secondary)" }}
          />
          {/* Content skeleton */}
          <div className="flex-1 px-4 pt-4 space-y-3">
            <div
              className="h-4 w-32 rounded animate-pulse"
              style={{ backgroundColor: "var(--background-secondary)" }}
            />
            <div
              className="h-6 w-full rounded animate-pulse"
              style={{ backgroundColor: "var(--background-secondary)" }}
            />
            <div
              className="h-6 w-3/4 rounded animate-pulse"
              style={{ backgroundColor: "var(--background-secondary)" }}
            />
            <div className="space-y-2 pt-2">
              <div
                className="h-4 w-full rounded animate-pulse"
                style={{ backgroundColor: "var(--background-secondary)" }}
              />
              <div
                className="h-4 w-full rounded animate-pulse"
                style={{ backgroundColor: "var(--background-secondary)" }}
              />
              <div
                className="h-4 w-2/3 rounded animate-pulse"
                style={{ backgroundColor: "var(--background-secondary)" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p style={{ color: "var(--error)" }}>Failed to load articles. Please try again.</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-6xl mb-4">📰</div>
        <p
          className="text-center"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            fontSize: "18px",
            color: "var(--foreground)",
          }}
        >
          No articles yet.
        </p>
        <p
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full" style={{ backgroundColor: "var(--background)" }}>
      {/* Full-page card swiper */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto hide-scrollbar"
        style={{
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {articles.map((article, idx) => (
          <div
            key={article.id}
            className="w-full"
            style={{
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              height: "100%",
            }}
          >
            <CardWithEntities
              article={article}
              isVisible={Math.abs(idx - currentIndex) <= 1}
              onArticleClick={onArticleClick}
              onEntityTap={(entity, articleId) =>
                setSelectedEntity({ entity, articleId })
              }
            />
          </div>
        ))}
      </div>

      {/* Entity Context Popup */}
      {selectedEntity && (
        <ContextPopup
          entity={selectedEntity.entity}
          articleId={selectedEntity.articleId}
          onClose={() => setSelectedEntity(null)}
          onViewReferences={() => {
            setSelectedEntity(null);
            router.push(`/article/${selectedEntity.articleId}/reference`);
          }}
        />
      )}

      {/* Page Indicator Dots */}
      {articles.length > 1 && (
        <div
          className="absolute right-2 flex flex-col items-center gap-1.5 z-10"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {articles.map((_, idx) => (
            <div
              key={idx}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === currentIndex ? "6px" : "4px",
                height: idx === currentIndex ? "6px" : "4px",
                backgroundColor:
                  idx === currentIndex
                    ? "var(--accent-primary)"
                    : "var(--text-tertiary)",
                opacity: idx === currentIndex ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
