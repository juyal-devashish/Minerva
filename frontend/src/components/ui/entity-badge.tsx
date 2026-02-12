"use client";

export type EntityType =
  | "person"
  | "organization"
  | "event"
  | "concept"
  | "location";

interface EntityBadgeProps {
  type: string;
  label?: string;
}

const entityTypeColors: Record<string, string> = {
  person: "var(--entity-person)",
  organization: "var(--entity-organization)",
  event: "var(--entity-event)",
  concept: "var(--entity-concept)",
  location: "var(--entity-location)",
};

const entityTypeLabels: Record<string, string> = {
  person: "Person",
  organization: "Organization",
  event: "Event",
  concept: "Concept",
  location: "Location",
};

export function EntityBadge({ type, label }: EntityBadgeProps) {
  const displayLabel = label || entityTypeLabels[type] || type;
  const color = entityTypeColors[type] || "var(--text-secondary)";

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        fontFamily: "Roboto, sans-serif",
        fontWeight: 500,
        fontSize: "11px",
      }}
    >
      {displayLabel}
    </span>
  );
}
