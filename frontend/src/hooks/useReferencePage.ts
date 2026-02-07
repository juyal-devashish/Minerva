import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useReferencePage(articleId: string) {
  return useQuery({
    queryKey: ["reference", articleId],
    queryFn: () => api.getReferencePage(articleId),
    enabled: !!articleId,
  });
}
