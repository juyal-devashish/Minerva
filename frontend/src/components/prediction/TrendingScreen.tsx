"use client";

import { useRouter } from "next/navigation";
import { Brain, TrendingUp, Users, ChevronRight } from "lucide-react";
import { useTrendingPredictions } from "@/hooks/usePrediction";
import type { TrendingPrediction } from "@/types";

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ImpactBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--background-secondary)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            backgroundColor:
              score > 70
                ? "var(--error)"
                : score > 40
                ? "var(--entity-event)"
                : "var(--success)",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "Roboto, sans-serif",
          fontSize: "11px",
          fontWeight: 500,
          color: "var(--text-tertiary)",
        }}
      >
        {score}
      </span>
    </div>
  );
}

function TrendingCard({ prediction, rank }: { prediction: TrendingPrediction; rank: number }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/article/${prediction.article_id}`)}
      className="w-full text-left rounded-xl overflow-hidden transition-transform active:scale-[0.98]"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex gap-3 p-3">
        {/* Rank + Image */}
        <div className="relative flex-shrink-0">
          {prediction.article_image_url ? (
            <img
              src={prediction.article_image_url}
              alt=""
              className="w-20 h-20 rounded-lg object-cover"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--background-secondary)" }}
            >
              <Brain size={24} style={{ color: "var(--text-tertiary)" }} />
            </div>
          )}
          <div
            className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: rank <= 3 ? "var(--accent-primary)" : "var(--text-tertiary)",
            }}
          >
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "12px",
                color: "white",
              }}
            >
              {rank}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "11px",
                color: "var(--text-tertiary)",
              }}
            >
              {prediction.article_source}
            </span>
            <span style={{ color: "var(--text-tertiary)", fontSize: "11px" }}>·</span>
            <span
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "11px",
                color: "var(--text-tertiary)",
              }}
            >
              {formatTimeAgo(prediction.completed_at)}
            </span>
          </div>

          <h3
            className="line-clamp-2 mb-1.5"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "1.3",
              color: "var(--foreground)",
            }}
          >
            {prediction.article_title}
          </h3>

          {/* Impact */}
          <ImpactBar score={prediction.impact_score} />
        </div>

        <ChevronRight
          size={16}
          className="flex-shrink-0 mt-1"
          style={{ color: "var(--text-tertiary)" }}
        />
      </div>

      {/* Prediction Summary */}
      {prediction.prediction_summary && (
        <div
          className="px-3 pb-3"
          style={{
            borderTop: "1px solid var(--divider)",
          }}
        >
          <p
            className="pt-2 line-clamp-2"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "12.5px",
              lineHeight: "1.4",
              color: "var(--text-secondary)",
            }}
          >
            <Brain
              size={12}
              className="inline mr-1"
              style={{ color: "var(--accent-primary)", verticalAlign: "text-bottom" }}
            />
            {prediction.prediction_summary}
          </p>
        </div>
      )}
    </button>
  );
}

export function TrendingScreen() {
  const { data: predictions, isLoading, error } = useTrendingPredictions();

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={20} style={{ color: "var(--accent-primary)" }} />
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "22px",
              color: "var(--foreground)",
            }}
          >
            Trending Predictions
          </h1>
        </div>
        <p
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          AI-predicted outcomes ranked by impact
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-3">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl animate-pulse"
                style={{ backgroundColor: "var(--background-secondary)" }}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "14px",
                color: "var(--text-tertiary)",
              }}
            >
              Failed to load trending predictions
            </p>
          </div>
        )}

        {predictions && predictions.length === 0 && (
          <div className="text-center py-12">
            <Brain
              size={48}
              className="mx-auto mb-4"
              style={{ color: "var(--text-tertiary)", opacity: 0.4 }}
            />
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                color: "var(--text-secondary)",
              }}
            >
              No predictions yet
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "13px",
                color: "var(--text-tertiary)",
              }}
            >
              Predictions will appear here as articles are analyzed
            </p>
          </div>
        )}

        {predictions?.map((prediction, index) => (
          <TrendingCard
            key={prediction.id}
            prediction={prediction}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
