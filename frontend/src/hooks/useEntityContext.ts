import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useEntityContext(entityId: string) {
  return useQuery({
    queryKey: ["context", entityId],
    queryFn: () => api.getEntityContext(entityId),
    enabled: !!entityId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
