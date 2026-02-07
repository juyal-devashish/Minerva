"use client";

export default function SearchPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <input
        type="search"
        placeholder="Search articles..."
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <p className="text-sm text-muted-foreground mt-4">
        Semantic search coming soon.
      </p>
    </main>
  );
}
