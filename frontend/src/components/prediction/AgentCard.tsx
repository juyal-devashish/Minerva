"use client";

import { useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useAgentInterview } from "@/hooks/usePrediction";
import type { AgentPerspective } from "@/types";

interface Props {
  agent: AgentPerspective;
  predictionId: string;
  onSelect: () => void;
}

const stanceColors: Record<string, string> = {
  positive: "#2D7A4F",
  negative: "#C94444",
  neutral: "#5A5A6E",
  mixed: "#B5764A",
};

const stanceEmoji: Record<string, string> = {
  positive: "+",
  negative: "-",
  neutral: "~",
  mixed: "?",
};

export function AgentCard({ agent, predictionId, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [question, setQuestion] = useState("");
  const [interviewResponse, setInterviewResponse] = useState<string | null>(null);
  const interview = useAgentInterview();

  const handleInterview = async () => {
    if (!question.trim()) return;
    const result = await interview.mutateAsync({
      prediction_id: predictionId,
      agent_perspective_id: agent.id,
      question: question.trim(),
    });
    setInterviewResponse(result.response);
    setQuestion("");
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: `1px solid var(--border)`,
        backgroundColor: "var(--background)",
      }}
    >
      {/* Agent Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2.5 flex items-center gap-3"
      >
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: stanceColors[agent.stance] + "20",
            border: `2px solid ${stanceColors[agent.stance]}`,
          }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              color: stanceColors[agent.stance],
            }}
          >
            {agent.agent_name.charAt(0)}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--foreground)",
              }}
            >
              {agent.agent_name}
            </span>
            <span
              className="px-1.5 py-0.5 rounded"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "10px",
                fontWeight: 500,
                backgroundColor: stanceColors[agent.stance] + "20",
                color: stanceColors[agent.stance],
              }}
            >
              {agent.stance}
            </span>
          </div>
          <span
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "12px",
              color: "var(--text-tertiary)",
            }}
          >
            {agent.agent_role}
          </span>
        </div>

        {expanded ? (
          <ChevronUp size={16} style={{ color: "var(--text-tertiary)" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "var(--text-tertiary)" }} />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-3 pb-3">
          {/* Perspective */}
          <p
            className="mb-2"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "13px",
              lineHeight: "1.45",
              color: "var(--foreground)",
            }}
          >
            {agent.perspective_text}
          </p>

          {/* Key Argument */}
          {agent.key_argument && (
            <div
              className="px-3 py-2 rounded-lg mb-3"
              style={{
                backgroundColor: stanceColors[agent.stance] + "10",
                borderLeft: `3px solid ${stanceColors[agent.stance]}`,
              }}
            >
              <span
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                }}
              >
                &quot;{agent.key_argument}&quot;
              </span>
            </div>
          )}

          {/* Interview Response */}
          {interviewResponse && (
            <div
              className="px-3 py-2 rounded-lg mb-3"
              style={{
                backgroundColor: "var(--background-secondary)",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                }}
              >
                {agent.agent_name} says:
              </span>
              <p
                className="mt-1"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "13px",
                  lineHeight: "1.4",
                  color: "var(--foreground)",
                }}
              >
                {interviewResponse}
              </p>
            </div>
          )}

          {/* Interview Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInterview()}
              placeholder={`Ask ${agent.agent_name}...`}
              className="flex-1 px-3 py-2 rounded-lg outline-none"
              style={{
                backgroundColor: "var(--background-secondary)",
                fontFamily: "Roboto, sans-serif",
                fontSize: "13px",
                color: "var(--foreground)",
              }}
            />
            <button
              onClick={handleInterview}
              disabled={!question.trim() || interview.isPending}
              className="px-3 py-2 rounded-lg flex items-center justify-center disabled:opacity-40 transition-opacity"
              style={{
                backgroundColor: "var(--accent-primary)",
              }}
            >
              <MessageSquare size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
