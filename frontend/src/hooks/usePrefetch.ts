"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "@/lib/api";

export function usePrefetch(articleId: string, nextArticleId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch reference page for current article
    queryClient.prefetchQuery({
      queryKey: ["reference", articleId],
      queryFn: () => api.getReferencePage(articleId),
    });

    // Prefetch next article if available
    if (nextArticleId) {
      queryClient.prefetchQuery({
        queryKey: ["article", nextArticleId],
        queryFn: () => api.getArticle(nextArticleId),
      });
    }
  }, [articleId, nextArticleId, queryClient]);
}
