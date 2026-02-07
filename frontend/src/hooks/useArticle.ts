import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useArticle(articleId: string) {
  return useQuery({
    queryKey: ["article", articleId],
    queryFn: () => api.getArticle(articleId),
    enabled: !!articleId,
  });
}
