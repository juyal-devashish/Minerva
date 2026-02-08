import type {
  FeedResponse,
  ArticleDetail,
  ContextResponse,
  ReferenceResponse,
  ExplainRequest,
  ExplainResponse,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  getFeed(params?: { page?: number; limit?: number; category?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.category && params.category !== "all") {
      searchParams.set("category", params.category);
    }
    const qs = searchParams.toString();
    return fetchAPI<FeedResponse>(`/api/v1/feed${qs ? `?${qs}` : ""}`);
  },

  getArticle(articleId: string) {
    return fetchAPI<ArticleDetail>(`/api/v1/articles/${articleId}`);
  },

  getEntityContext(entityId: string) {
    return fetchAPI<ContextResponse>(`/api/v1/context/${entityId}`);
  },

  getReferencePage(articleId: string) {
    return fetchAPI<ReferenceResponse>(
      `/api/v1/articles/${articleId}/reference`
    );
  },

  explainEntity(request: ExplainRequest) {
    return fetchAPI<ExplainResponse>(`/api/v1/context/explain`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};
