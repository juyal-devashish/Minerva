"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { EntityBadge } from "@/components/ui/entity-badge";
import type { ReferenceResponse, ReferenceEntityContext } from "@/types";

interface Props {
  data: ReferenceResponse;
}

const entityTypeLabels: Record<string, string> = {
  person: "People",
  organization: "Organizations",
  event: "Events",
  concept: "Concepts",
  location: "Locations",
};

export function ReferencePage({ data }: Props) {
  const router = useRouter();
  const [expandedEntityId, setExpandedEntityId] = useState<string | null>(null);

  // Group entities by type
  const groupedEntities: Record<string, ReferenceEntityContext[]> = {};
  data.entities.forEach((entity) => {
    const type = entity.type || "concept";
    if (!groupedEntities[type]) {
      groupedEntities[type] = [];
    }
    groupedEntities[type].push(entity);
  });

  const toggleEntity = (entityId: string) => {
    setExpandedEntityId(expandedEntityId === entityId ? null : entityId);
  };

  return (
    <div
      className="flex flex-col h-screen max-w-[393px] mx-auto"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{
          borderColor: "var(--divider)",
          backgroundColor: "var(--surface)",
        }}
      >
        <button
          onClick={() => router.push(`/article/${data.article.id}`)}
          className="flex items-center gap-2 mb-2"
        >
          <ArrowLeft size={20} style={{ color: "var(--foreground)" }} />
        </button>
        <h1
          className="mb-1"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "22px",
            color: "var(--foreground)",
          }}
        >
          Key References
        </h1>
        <p
          className="mb-1 line-clamp-1"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            lineHeight: "1.4",
            color: "var(--text-secondary)",
          }}
        >
          {data.article.title}
        </p>
        <p
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "13px",
            color: "var(--text-tertiary)",
          }}
        >
          {data.entities.length} terms found
        </p>
      </div>

      {/* Entity Groups */}
      <div className="flex-1 overflow-y-auto pb-20 px-4 py-4">
        {Object.entries(groupedEntities).map(([type, entities]) => (
          <div key={type} className="mb-6">
            {/* Section Header */}
            <h2
              className="mb-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                color: "var(--text-secondary)",
              }}
            >
              {entityTypeLabels[type] || type} ({entities.length})
            </h2>

            {/* Entity Rows */}
            <div className="space-y-2">
              {entities.map((entity) => {
                const isExpanded = expandedEntityId === entity.id;

                return (
                  <div
                    key={entity.id}
                    className="rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: "var(--background-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {/* Entity Row Header */}
                    <button
                      onClick={() => toggleEntity(entity.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--background)] transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                              fontSize: "16px",
                              color: "var(--foreground)",
                            }}
                          >
                            {entity.name}
                          </span>
                        </div>
                        {!isExpanded && entity.context && (
                          <p
                            className="line-clamp-1"
                            style={{
                              fontFamily: "Roboto, sans-serif",
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {entity.context}
                          </p>
                        )}
                      </div>
                      <div className="ml-3">
                        {isExpanded ? (
                          <ChevronUp
                            size={20}
                            style={{ color: "var(--text-tertiary)" }}
                          />
                        ) : (
                          <ChevronDown
                            size={20}
                            style={{ color: "var(--text-tertiary)" }}
                          />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div
                        className="px-4 pb-4 border-t"
                        style={{ borderColor: "var(--divider)" }}
                      >
                        <div className="pt-3 mb-3">
                          <EntityBadge type={entity.type} />
                        </div>
                        {entity.context && (
                          <p
                            style={{
                              fontFamily: "Roboto, sans-serif",
                              fontSize: "14px",
                              lineHeight: "1.6",
                              color: "var(--foreground)",
                            }}
                          >
                            {entity.context}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
