"use client";

import { useParams } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { useArticle } from "@/hooks/useArticle";

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const { data: article, isLoading, error } = useArticle(articleId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Failed to load article</p>
      </div>
    );
  }

  return <ArticleView article={article} />;
}
