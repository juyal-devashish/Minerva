import { ContextCard } from "@/components/context/ContextCard";
import type { ReferenceEntityContext } from "@/types";

interface Props {
  entities: ReferenceEntityContext[];
}

export function EntityList({ entities }: Props) {
  if (!entities.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No entities found in this article.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entities.map((entity) => (
        <ContextCard
          key={entity.id}
          name={entity.name}
          type={entity.type}
          context={entity.context}
          wikipedia_url={entity.wikipedia_url}
        />
      ))}
    </div>
  );
}
