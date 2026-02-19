"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { ArticleCard as ArticleCardType } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

interface Props {
  article: ArticleCardType;
  variant?: "hero" | "standard" | "compact";
  onClick?: () => void;
}

export function ArticleCard({ article, variant = "standard", onClick }: Props) {
  const timeAgo = formatTimeAgo(article.published_at);
  const readTime = article.reading_time_minutes
    ? `${article.reading_time_minutes} min read`
    : "";

  const content = (() => {
    if (variant === "hero") {
      return (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden cursor-pointer mb-3">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ backgroundColor: "var(--background-secondary)" }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-white/80"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "12px",
                }}
              >
                {article.source.name}
                {timeAgo && ` · ${timeAgo}`}
              </span>
            </div>
            <h2
              className="text-white mb-2 line-clamp-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "1.3",
              }}
            >
              {article.title}
            </h2>
            {article.entity_count > 0 && (
              <div className="flex items-center gap-2">
                <div
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(107, 159, 212, 0.3)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Sparkles size={12} className="text-white" />
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 500,
                      fontSize: "11px",
                    }}
                  >
                    {article.entity_count} key terms
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (variant === "compact") {
      return (
        <div className="flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-[var(--background-secondary)] transition-colors">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-[72px] h-[72px] rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3
              className="line-clamp-2 mb-1"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "15px",
                lineHeight: "1.4",
                color: "var(--foreground)",
              }}
            >
              {article.title}
            </h3>
            <div
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "12px",
                color: "var(--text-tertiary)",
              }}
            >
              <span>{article.source.name}</span>
              {timeAgo && (
                <>
                  <span>·</span>
                  <span>{timeAgo}</span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Standard variant
    return (
      <div
        className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01]"
        style={{
          backgroundColor: "var(--background-secondary)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-[180px] object-cover"
          />
        )}
        <div className="p-4">
          <h3
            className="line-clamp-2 mb-2"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "17px",
              lineHeight: "1.4",
              color: "var(--foreground)",
            }}
          >
            {article.title}
          </h3>
          {article.summary && (
            <p
              className="line-clamp-2 mb-3"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "var(--text-secondary)",
              }}
            >
              {article.summary}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "12px",
                color: "var(--text-tertiary)",
              }}
            >
              <span>{article.source.name}</span>
              {timeAgo && (
                <>
                  <span>·</span>
                  <span>{timeAgo}</span>
                </>
              )}
              {readTime && (
                <>
                  <span>·</span>
                  <span>{readTime}</span>
                </>
              )}
            </div>
            {article.entity_count > 0 && (
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "rgba(58, 90, 140, 0.15)",
                  color: "var(--accent-secondary)",
                }}
              >
                <Sparkles size={10} />
                <span
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 500,
                    fontSize: "11px",
                  }}
                >
                  {article.entity_count} key terms
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  })();

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link href={`/article/${article.id}`}>{content}</Link>;
}
