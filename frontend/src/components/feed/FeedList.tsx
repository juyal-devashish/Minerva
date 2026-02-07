"use client";

import { useFeed } from "@/hooks/useFeed";
import { ArticleCard } from "./ArticleCard";

export function FeedList() {
  const { data, isLoading, error } = useFeed();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-destructive py-8">
        Failed to load articles. Please try again.
      </p>
    );
  }

  if (!data?.articles.length) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No articles yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {data.articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
