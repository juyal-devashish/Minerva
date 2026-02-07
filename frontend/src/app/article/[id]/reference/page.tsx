"use client";

import { useParams } from "next/navigation";
import { ReferencePage } from "@/components/reference/ReferencePage";
import { useReferencePage } from "@/hooks/useReferencePage";

export default function ReferencePageView() {
  const params = useParams();
  const articleId = params.id as string;
  const { data, isLoading, error } = useReferencePage(articleId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Failed to load reference page</p>
      </div>
    );
  }

  return <ReferencePage data={data} />;
}
