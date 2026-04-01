"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { usePredictionChat } from "@/hooks/usePrediction";

interface Props {
  predictionId: string;
  articleTitle: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function PredictionChat({ predictionId, articleTitle }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatMutation = usePredictionChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    try {
      const result = await chatMutation.mutateAsync({
        prediction_id: predictionId,
        message: userMsg.content,
        history: updatedMessages,
      });
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: result.response },
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Sorry, I couldn't process that question." },
      ]);
    }
  };

  return (
    <div
      className="border-t"
      style={{ borderColor: "var(--divider)" }}
    >
      {/* Messages */}
      <div
        ref={scrollRef}
        className="px-4 py-3 space-y-3 overflow-y-auto"
        style={{ maxHeight: "200px" }}
      >
        {messages.length === 0 && (
          <p
            className="text-center py-4"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "13px",
              color: "var(--text-tertiary)",
            }}
          >
            Ask anything about this prediction report
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[80%] px-3 py-2 rounded-2xl"
              style={{
                backgroundColor:
                  msg.role === "user"
                    ? "var(--accent-primary)"
                    : "var(--background-secondary)",
              }}
            >
              <p
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "13px",
                  lineHeight: "1.4",
                  color:
                    msg.role === "user" ? "white" : "var(--foreground)",
                }}
              >
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2 rounded-2xl flex items-center gap-2"
              style={{ backgroundColor: "var(--background-secondary)" }}
            >
              <Loader2
                size={14}
                className="animate-spin"
                style={{ color: "var(--text-tertiary)" }}
              />
              <span
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "13px",
                  color: "var(--text-tertiary)",
                }}
              >
                Thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="What will happen if...?"
          className="flex-1 px-4 py-2.5 rounded-xl outline-none"
          style={{
            backgroundColor: "var(--background-secondary)",
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            color: "var(--foreground)",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || chatMutation.isPending}
          className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-opacity"
          style={{
            backgroundColor: "var(--accent-primary)",
          }}
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
