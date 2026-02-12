"use client";

import { useFeed } from "@/hooks/useFeed";
import { ArticleCard } from "./ArticleCard";

interface FeedListProps {
  category?: string;
  onArticleClick?: (articleId: string) => void;
}

export function FeedList({ category, onArticleClick }: FeedListProps) {
  const { data, isLoading, error } = useFeed({ category });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Hero skeleton */}
        <div
          className="h-[400px] rounded-xl animate-pulse"
          style={{ backgroundColor: "var(--background-secondary)" }}
        />
        {/* Standard skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden animate-pulse"
            style={{ backgroundColor: "var(--background-secondary)" }}
          >
            <div className="h-[180px]" />
            <div className="p-4 space-y-2">
              <div
                className="h-5 w-3/4 rounded"
                style={{ backgroundColor: "var(--divider)" }}
              />
              <div
                className="h-4 w-full rounded"
                style={{ backgroundColor: "var(--divider)" }}
              />
              <div
                className="h-3 w-1/2 rounded"
                style={{ backgroundColor: "var(--divider)" }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p
        className="text-center py-8"
        style={{ color: "var(--error)" }}
      >
        Failed to load articles. Please try again.
      </p>
    );
  }

  if (!data?.articles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
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

  const [heroArticle, ...restArticles] = data.articles;

  return (
    <>
      {/* Hero Card */}
      <ArticleCard
        article={heroArticle}
        variant="hero"
        onClick={onArticleClick ? () => onArticleClick(heroArticle.id) : undefined}
      />

      {/* Standard Cards */}
      <div className="space-y-3">
        {restArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="standard"
            onClick={onArticleClick ? () => onArticleClick(article.id) : undefined}
          />
        ))}
      </div>
    </>
  );
}
