import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { RelatedArticle } from "@/types";

interface Props {
  articles: RelatedArticle[];
}

export function RelatedArticles({ articles }: Props) {
  return (
    <div className="space-y-2">
      {articles.map((article) => (
        <Link key={article.id} href={`/article/${article.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-3">
              <h3 className="font-medium text-sm">{article.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>{article.source}</span>
                {article.published_at && (
                  <>
                    <span>&middot;</span>
                    <time>
                      {new Date(article.published_at).toLocaleDateString()}
                    </time>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
