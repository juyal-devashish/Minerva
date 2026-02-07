"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EntityList } from "./EntityList";
import { RelatedArticles } from "./RelatedArticles";
import type { ReferenceResponse } from "@/types";

interface Props {
  data: ReferenceResponse;
}

export function ReferencePage({ data }: Props) {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Reference</h1>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {data.article.title}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/article/${data.article.id}`}>Back to article</Link>
        </Button>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Key Entities ({data.entities.length})
        </h2>
        <EntityList entities={data.entities} />
      </section>

      {data.related_articles.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Related Articles</h2>
          <RelatedArticles articles={data.related_articles} />
        </section>
      )}
    </main>
  );
}
