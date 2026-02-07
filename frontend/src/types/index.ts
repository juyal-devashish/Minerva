// ============ Feed ============

export interface ArticleCardSource {
  name: string;
  logo_url?: string;
}

export interface ArticleCard {
  id: string;
  title: string;
  summary?: string;
  image_url?: string;
  source: ArticleCardSource;
  published_at?: string;
  reading_time_minutes?: number;
  categories: string[];
  entity_count: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  has_next: boolean;
}

export interface FeedResponse {
  articles: ArticleCard[];
  pagination: PaginationMeta;
}

// ============ Article ============

export interface SourceInfo {
  name: string;
  url?: string;
  credibility_score?: number;
}

export interface EntityInArticle {
  id: string;
  text: string;
  type: string;
  start: number;
  end: number;
  priority: string;
}

export interface ArticleDetail {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  image_url?: string;
  source: SourceInfo;
  published_at?: string;
  reading_time_minutes?: number;
  categories: string[];
  entities: EntityInArticle[];
}

// ============ Reference ============

export interface ReferenceEntityContext {
  id: string;
  name: string;
  type: string;
  context?: string;
  wikipedia_url?: string;
  image_url?: string;
}

export interface RelatedArticle {
  id: string;
  title: string;
  source: string;
  published_at?: string;
}

export interface ReferenceResponse {
  article: ArticleDetail;
  entities: ReferenceEntityContext[];
  related_articles: RelatedArticle[];
}

// ============ Context ============

export interface EntityInfo {
  id: string;
  name: string;
  type: string;
  wikidata_id?: string;
  wikipedia_url?: string;
}

export interface ContextData {
  text: string;
  generated_at: string;
  source: string;
  cached: boolean;
}

export interface ContextResponse {
  entity: EntityInfo;
  context: ContextData;
  related_entities: { id: string; name: string; type: string }[];
  related_articles: { id: string; title: string }[];
}

export interface ExplainRequest {
  entity_id: string;
  article_id: string;
  question: string;
}

export interface ExplainResponse {
  entity: EntityInfo;
  explanation: string;
  sources: { type: string; title?: string; url?: string }[];
  confidence: number;
}
