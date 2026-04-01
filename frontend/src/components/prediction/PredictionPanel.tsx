"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import type { PredictionDetail, AgentPerspective } from "@/types";
import { AgentCard } from "./AgentCard";
import { PredictionChat } from "./PredictionChat";

interface Props {
  prediction: PredictionDetail;
  articleTitle: string;
}

const stanceColors: Record<string, string> = {
  positive: "#2D7A4F",
  negative: "#C94444",
  neutral: "#5A5A6E",
  mixed: "#B5764A",
};

export function PredictionPanel({ prediction, articleTitle }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentPerspective | null>(null);

  const sentimentData = prediction.sentiment_distribution
    ? (() => {
        try {
          return JSON.parse(prediction.sentiment_distribution);
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: "var(--background-secondary)" }}
      >
        <div className="flex items-center gap-2">
          <Brain size={18} style={{ color: "var(--accent-primary)" }} />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "var(--foreground)",
            }}
          >
            AI Prediction
          </span>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              backgroundColor: "var(--accent-primary)",
              color: "white",
            }}
          >
            {prediction.agent_count} agents
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={18} style={{ color: "var(--text-secondary)" }} />
        ) : (
          <ChevronDown size={18} style={{ color: "var(--text-secondary)" }} />
        )}
      </button>

      {/* Summary (always visible) */}
      {prediction.prediction_summary && (
        <div className="px-4 py-3">
          <p
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "var(--foreground)",
            }}
          >
            {prediction.prediction_summary}
          </p>

          {/* Confidence */}
          {prediction.confidence_score != null && (
            <div className="flex items-center gap-2 mt-2">
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--background-secondary)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${prediction.confidence_score * 100}%`,
                    backgroundColor:
                      prediction.confidence_score > 0.7
                        ? "var(--success)"
                        : prediction.confidence_score > 0.4
                        ? "var(--entity-event)"
                        : "var(--error)",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "12px",
                  color: "var(--text-tertiary)",
                }}
              >
                {Math.round(prediction.confidence_score * 100)}% confidence
              </span>
            </div>
          )}
        </div>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Divider */}
            <div className="h-px mx-4" style={{ backgroundColor: "var(--divider)" }} />

            {/* Sentiment Distribution */}
            {sentimentData && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={14} style={{ color: "var(--text-secondary)" }} />
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Public Sentiment
                  </span>
                </div>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                  {sentimentData.positive > 0 && (
                    <div
                      className="rounded-l-full"
                      style={{
                        width: `${sentimentData.positive}%`,
                        backgroundColor: "#2D7A4F",
                      }}
                    />
                  )}
                  {sentimentData.neutral > 0 && (
                    <div
                      style={{
                        width: `${sentimentData.neutral}%`,
                        backgroundColor: "#9090A0",
                      }}
                    />
                  )}
                  {sentimentData.negative > 0 && (
                    <div
                      className="rounded-r-full"
                      style={{
                        width: `${sentimentData.negative}%`,
                        backgroundColor: "#C94444",
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between mt-1">
                  {[
                    { label: "Positive", value: sentimentData.positive, color: "#2D7A4F" },
                    { label: "Neutral", value: sentimentData.neutral, color: "#9090A0" },
                    { label: "Negative", value: sentimentData.negative, color: "#C94444" },
                  ].map((s) => (
                    <span
                      key={s.label}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "11px",
                        color: s.color,
                      }}
                    >
                      {s.label} {s.value}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Findings */}
            {prediction.key_findings.length > 0 && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={14} style={{ color: "var(--text-secondary)" }} />
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Key Findings
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {prediction.key_findings.map((finding, i) => (
                    <li
                      key={i}
                      className="flex gap-2"
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "13px",
                        lineHeight: "1.4",
                        color: "var(--foreground)",
                      }}
                    >
                      <span style={{ color: "var(--text-tertiary)" }}>•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Predicted Outcomes */}
            {prediction.predicted_outcomes.length > 0 && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle size={14} style={{ color: "var(--text-secondary)" }} />
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Predicted Outcomes
                  </span>
                </div>
                <div className="space-y-2">
                  {prediction.predicted_outcomes.map((outcome, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: "var(--background-secondary)",
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "13px",
                        color: "var(--foreground)",
                      }}
                    >
                      <span
                        className="mr-2"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          fontSize: "11px",
                          color:
                            i === 0
                              ? "var(--success)"
                              : i === 1
                              ? "var(--entity-event)"
                              : "var(--text-tertiary)",
                        }}
                      >
                        {i === 0 ? "LIKELY" : i === 1 ? "POSSIBLE" : "UNLIKELY"}
                      </span>
                      {outcome}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Perspectives */}
            {prediction.agent_perspectives.length > 0 && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-3">
                  <Users size={14} style={{ color: "var(--text-secondary)" }} />
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Stakeholder Perspectives
                  </span>
                </div>
                <div className="space-y-2">
                  {prediction.agent_perspectives.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      predictionId={prediction.id}
                      onSelect={() => setSelectedAgent(agent)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Chat with Report */}
            <div className="px-4 py-3">
              <button
                onClick={() => setShowChat(!showChat)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors"
                style={{
                  backgroundColor: "var(--accent-primary)",
                }}
              >
                <MessageCircle size={16} className="text-white" />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  {showChat ? "Hide Chat" : "Ask about this prediction"}
                </span>
              </button>
            </div>

            {/* Chat Interface */}
            {showChat && (
              <PredictionChat
                predictionId={prediction.id}
                articleTitle={articleTitle}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
