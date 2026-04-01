"use client";

import { Bookmark, Share2, MoreHorizontal } from "lucide-react";
import type { ArticleCard, EntityInArticle } from "@/types";
import { formatTimeAgo } from "@/lib/utils";
import { usePrediction } from "@/hooks/usePrediction";
import { PredictionBadge } from "@/components/prediction/PredictionBadge";

interface FullPageCardProps {
  article: ArticleCard;
  entities?: EntityInArticle[];
  onClick: () => void;
  onEntityTap?: (entity: EntityInArticle) => void;
}

function highlightSummary(
  summary: string,
  entities: EntityInArticle[],
  onEntityTap: (entity: EntityInArticle) => void
) {
  // Deduplicate entities by text (keep highest priority)
  const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const uniqueMap = new Map<string, EntityInArticle>();
  for (const e of entities) {
    const key = e.text.toLowerCase();
    const existing = uniqueMap.get(key);
    if (!existing || (priorityOrder[e.priority] ?? 0) > (priorityOrder[existing.priority] ?? 0)) {
      uniqueMap.set(key, e);
    }
  }

  // Find all entity occurrences in the summary via text matching
  const matches: { start: number; end: number; entity: EntityInArticle }[] = [];
  for (const entity of Array.from(uniqueMap.values())) {
    const regex = new RegExp(`\\b${entity.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    let match;
    while ((match = regex.exec(summary)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length, entity });
    }
  }

  if (matches.length === 0) return <span>{summary}</span>;

  // Sort by start position, remove overlaps
  matches.sort((a, b) => a.start - b.start);
  const filtered: typeof matches = [];
  for (const m of matches) {
    if (filtered.length === 0 || m.start >= filtered[filtered.length - 1].end) {
      filtered.push(m);
    }
  }

  const segments: React.ReactNode[] = [];
  let lastEnd = 0;
  for (const m of filtered) {
    if (m.start > lastEnd) {
      segments.push(<span key={`t-${lastEnd}`}>{summary.slice(lastEnd, m.start)}</span>);
    }
    const entityTypeColors: Record<string, string> = {
      person: "#4A7AB5", organization: "#7A5AB5", event: "#B5764A",
      concept: "#4AB58A", location: "#B54A6E",
    };
    const borderColor = entityTypeColors[m.entity.type.toLowerCase()] ?? "var(--accent-secondary)";
    segments.push(
      <span
        key={`e-${m.start}`}
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onEntityTap(m.entity); }}
        onKeyDown={(e) => e.key === "Enter" && onEntityTap(m.entity)}
        style={{
          backgroundColor: "var(--entity-highlight)",
          borderBottom: `2px solid ${borderColor}`,
          borderRadius: "2px",
          padding: "1px 2px",
          cursor: "pointer",
          transition: "all 0.1s ease",
        }}
      >
        {summary.slice(m.start, m.end)}
      </span>
    );
    lastEnd = m.end;
  }
  if (lastEnd < summary.length) {
    segments.push(<span key={`t-${lastEnd}`}>{summary.slice(lastEnd)}</span>);
  }
  return <>{segments}</>;
}

export function FullPageCard({ article, entities, onClick, onEntityTap }: FullPageCardProps) {
  const timeAgo = formatTimeAgo(article.published_at);
  const readTime = article.reading_time_minutes
    ? `${article.reading_time_minutes} min read`
    : "";
  const { data: prediction } = usePrediction(article.id);

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Image Section - top ~35% */}
      <div className="relative w-full flex-shrink-0" style={{ height: "35%" }}>
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "var(--background-secondary)" }}
          >
            <span className="text-6xl opacity-30">📰</span>
          </div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <MoreHorizontal size={18} className="text-white" />
        </button>
        {/* Prediction Badge */}
        {prediction && prediction.status !== "failed" && (
          <div className="absolute bottom-3 left-3">
            <PredictionBadge
              status={prediction.status}
              confidence={prediction.confidence_score}
              onClick={onClick}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        className="flex flex-col flex-1 px-4 pt-3 pb-2 overflow-hidden"
        onClick={onClick}
      >
        {/* Source Row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--foreground)",
              }}
            >
              {article.source.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-[var(--background-secondary)] rounded-md transition-colors">
              <Bookmark size={18} style={{ color: "var(--foreground)" }} />
            </button>
            <button className="p-1.5 hover:bg-[var(--background-secondary)] rounded-md transition-colors">
              <Share2 size={18} style={{ color: "var(--foreground)" }} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2
          className="mb-2 line-clamp-3"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "19px",
            lineHeight: "1.3",
            color: "var(--foreground)",
          }}
        >
          {article.title}
        </h2>

        {/* Summary */}
        {article.summary && (
          <p
            className="flex-1 overflow-hidden line-clamp-4"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "14.5px",
              lineHeight: "1.55",
              color: "var(--text-secondary)",
            }}
          >
            {entities && entities.length > 0 && onEntityTap
              ? highlightSummary(article.summary, entities, onEntityTap)
              : article.summary}
          </p>
        )}

        {/* Footer */}
        <div className="pt-2 pb-1 flex-shrink-0">
          <span
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "12px",
              color: "var(--text-tertiary)",
            }}
          >
            {[timeAgo, readTime, article.source.name]
              .filter(Boolean)
              .join(" | ")}
          </span>
        </div>
      </div>
    </div>
  );
}
