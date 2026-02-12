"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Bookmark, ChevronRight } from "lucide-react";
import { ArticleContent } from "./ArticleContent";
import { ContextPopup } from "@/components/context/ContextPopup";
import { EntityBadge } from "@/components/ui/entity-badge";
import type { ArticleDetail, EntityInArticle } from "@/types";

interface Props {
  article: ArticleDetail;
}

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ArticleView({ article }: Props) {
  const router = useRouter();
  const [selectedEntity, setSelectedEntity] = useState<EntityInArticle | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    const ref = contentRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, []);

  const timeAgo = formatTimeAgo(article.published_at);
  const readTime = article.reading_time_minutes
    ? `${article.reading_time_minutes} min read`
    : "";

  return (
    <div
      className="flex flex-col h-screen max-w-[393px] mx-auto"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Scroll Progress Bar */}
      <div
        className="h-1 transition-all"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: "var(--accent-primary)",
        }}
      />

      <div ref={contentRef} className="flex-1 overflow-y-auto pb-20">
        {/* Hero Image */}
        <div className="relative h-[280px]">
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
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)",
            }}
          />

          {/* Floating Top Bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Share2 size={18} className="text-white" />
              </button>
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Bookmark size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h1
              className="text-white line-clamp-4"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "1.3",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {article.title}
            </h1>
          </div>
        </div>

        {/* Metadata Bar */}
        <div
          className="px-5 py-3 border-b"
          style={{
            borderColor: "var(--divider)",
            backgroundColor: "var(--background)",
          }}
        >
          <div
            className="flex items-center gap-2"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "13px",
              color: "var(--text-secondary)",
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
        </div>

        {/* Category + View References */}
        <div className="px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {article.categories?.[0] && (
              <EntityBadge type="concept" label={article.categories[0]} />
            )}
          </div>
          <button
            onClick={() => router.push(`/article/${article.id}/reference`)}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                color: "var(--accent-primary)",
              }}
            >
              View all references
            </span>
            <ChevronRight size={16} style={{ color: "var(--accent-primary)" }} />
          </button>
        </div>

        {/* Article Body */}
        <div className="px-5 pb-8">
          <div
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "16px",
              lineHeight: "1.65",
              color: "var(--foreground)",
            }}
          >
            <ArticleContent
              article={article}
              onEntityTap={(entity) => setSelectedEntity(entity)}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 py-2 px-5 border-t"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          maxWidth: "393px",
          margin: "0 auto",
        }}
      >
        <p
          className="text-center"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          {article.entities.length} highlighted terms in this article
        </p>
      </div>

      {/* Entity Context Bottom Sheet */}
      {selectedEntity && (
        <ContextPopup
          entity={selectedEntity}
          articleId={article.id}
          onClose={() => setSelectedEntity(null)}
          onViewReferences={() => {
            setSelectedEntity(null);
            router.push(`/article/${article.id}/reference`);
          }}
        />
      )}
    </div>
  );
}
