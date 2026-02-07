import { FeedList } from "@/components/feed/FeedList";
import { CategoryTabs } from "@/components/feed/CategoryTabs";

export default function FeedPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Minerva</h1>
        <p className="text-sm text-muted-foreground">
          News with context, instantly
        </p>
      </header>
      <CategoryTabs />
      <FeedList />
    </main>
  );
}
