import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  name: string;
  type: string;
  context?: string | null;
  wikipedia_url?: string | null;
}

export function ContextCard({ name, type, context, wikipedia_url }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-xs text-muted-foreground uppercase">{type}</span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {context || "Context not yet generated."}
        </p>
        {wikipedia_url && (
          <a
            href={wikipedia_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline mt-2 inline-block"
          >
            Read more on Wikipedia
          </a>
        )}
      </CardContent>
    </Card>
  );
}
