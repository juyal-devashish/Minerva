"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { ArticleCard as ArticleCardType } from "@/types";

interface Props {
  article: ArticleCardType;
}

export function ArticleCard({ article }: Props) {
  return (
    <Link href={`/article/${article.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {article.image_url && (
              <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-muted">
                <img
                  src={article.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base line-clamp-2 mb-1">
                {article.title}
              </h2>
              {article.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {article.summary}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{article.source.name}</span>
                {article.reading_time_minutes && (
                  <>
                    <span>&middot;</span>
                    <span>{article.reading_time_minutes} min read</span>
                  </>
                )}
                {article.entity_count > 0 && (
                  <>
                    <span>&middot;</span>
                    <span>{article.entity_count} entities</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
