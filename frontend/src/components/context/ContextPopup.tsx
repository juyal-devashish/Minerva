"use client";

import { useEntityContext } from "@/hooks/useEntityContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EntityInArticle } from "@/types";

interface Props {
  entity: EntityInArticle;
  onClose: () => void;
  onFollowup: () => void;
}

export function ContextPopup({ entity, onClose, onFollowup }: Props) {
  const { data, isLoading, error } = useEntityContext(entity.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-sm mx-4 mb-4 sm:mb-0 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{entity.text}</h3>
              <span className="text-xs text-muted-foreground uppercase">
                {entity.type}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              X
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">
              Failed to load context. Tap to retry.
            </p>
          )}

          {data && (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {data.context.text}
              </p>

              <div className="flex gap-2">
                {data.entity.wikipedia_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={data.entity.wikipedia_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Wikipedia
                    </a>
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={onFollowup}>
                  Ask More
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
