import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useFeed(params?: {
  page?: number;
  limit?: number;
  category?: string;
}) {
  return useQuery({
    queryKey: ["feed", params],
    queryFn: () => api.getFeed(params),
  });
}
