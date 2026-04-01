"use client";

import { Brain, Loader2 } from "lucide-react";

interface Props {
  status: string;
  confidence?: number | null;
  onClick?: () => void;
}

export function PredictionBadge({ status, confidence, onClick }: Props) {
  const isRunning = ["queued", "building_graph", "simulating", "generating_report"].includes(status);
  const isComplete = status === "completed";

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all hover:scale-105"
      style={{
        backgroundColor: isComplete
          ? "var(--accent-primary)"
          : isRunning
          ? "var(--entity-event)"
          : "var(--error)",
        opacity: isRunning ? 0.9 : 1,
      }}
    >
      {isRunning ? (
        <Loader2 size={12} className="text-white animate-spin" />
      ) : (
        <Brain size={12} className="text-white" />
      )}
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: "11px",
          color: "white",
        }}
      >
        {isRunning
          ? "Predicting..."
          : isComplete && confidence != null
          ? `${Math.round(confidence * 100)}%`
          : "Prediction"}
      </span>
    </button>
  );
}
