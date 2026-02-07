import type { ArticleDetail } from "@/types";

interface Props {
  article: ArticleDetail;
}

export function ArticleHeader({ article }: Props) {
  return (
    <header className="mb-6">
      {article.image_url && (
        <div className="w-full h-48 rounded-lg overflow-hidden bg-muted mb-4">
          <img
            src={article.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{article.source.name}</span>
        {article.reading_time_minutes && (
          <>
            <span>&middot;</span>
            <span>{article.reading_time_minutes} min read</span>
          </>
        )}
        {article.published_at && (
          <>
            <span>&middot;</span>
            <time>{new Date(article.published_at).toLocaleDateString()}</time>
          </>
        )}
      </div>
    </header>
  );
}
