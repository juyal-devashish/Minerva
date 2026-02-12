"use client";

import type { EntityInArticle } from "@/types";

interface Props {
  entity: EntityInArticle;
  text: string;
  onTap: () => void;
}

export function EntityHighlight({ entity, text, onTap }: Props) {
  const getHighlightStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      cursor: "pointer",
      transition: "all 0.1s ease",
      borderRadius: "2px",
      padding: "1px 2px",
    };

    switch (entity.priority) {
      case "high":
        return {
          ...base,
          backgroundColor: "var(--entity-highlight)",
          borderBottom: "2px solid var(--accent-secondary)",
        };
      case "medium":
        return {
          ...base,
          backgroundColor: "var(--entity-highlight)",
          borderBottom: "1.5px solid var(--accent-secondary)",
        };
      default:
        return {
          ...base,
          backgroundColor: "rgba(245, 230, 200, 0.3)",
          borderBottom: "1px dotted var(--accent-secondary)",
        };
    }
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onTap}
      onKeyDown={(e) => e.key === "Enter" && onTap()}
      style={getHighlightStyle()}
    >
      {text}
    </span>
  );
}
