"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  entityId: string;
  articleId: string;
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

export function FollowupInput({
  onSubmit,
  isLoading = false,
}: Props) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
      setQuestion("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a follow-up question..."
        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        disabled={isLoading}
      />
      <Button type="submit" size="sm" disabled={isLoading || !question.trim()}>
        {isLoading ? "..." : "Ask"}
      </Button>
    </form>
  );
}
