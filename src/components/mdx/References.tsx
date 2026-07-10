import { cn } from "@lib/utils";
import { ExternalLink } from "lucide-react";

interface Reference {
  id: string;
  title: string;
  url: string;
  source?: string;
  date?: string;
}

interface ReferencesProps {
  references: Reference[];
  className?: string;
}

export function References({ references, className }: ReferencesProps) {
  if (references.length === 0) return null;

  return (
    <section
      id="references"
      aria-labelledby="references-heading"
      className={cn("mt-12", className)}
    >
      <h2
        id="references-heading"
        className="mb-4 text-2xl font-semibold tracking-tight"
      >
        References
      </h2>
      <ol className="space-y-3">
        {references.map((ref) => (
          <li
            key={ref.id}
            id={`ref-${ref.id}`}
            className="scroll-mt-24 text-sm leading-relaxed text-muted-foreground"
          >
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-1 font-medium text-foreground hover:text-primary hover:underline"
            >
              <span>[{ref.id}]</span>
              <span>{ref.title}</span>
              <ExternalLink
                size={12}
                className="mt-1 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              />
            </a>
            {(ref.source || ref.date) && (
              <span className="ml-1 text-muted-foreground">
                —{ref.source && <span className="ml-1">{ref.source}</span>}
                {ref.date && <span className="ml-1">({ref.date})</span>}
              </span>
            )}
            <a
              href={`#cite-${ref.id}`}
              className="ml-2 text-xs text-primary hover:underline"
              aria-label={`Back to citation ${ref.id}`}
            >
              ↩
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
