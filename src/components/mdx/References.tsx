import { cn } from "@lib/utils";
import { ExternalLink } from "lucide-react";
import { CopyButton } from "./CopyButton";

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

function formatCitation(ref: Reference): string {
  const parts: string[] = [];
  if (ref.source) parts.push(ref.source);
  parts.push(`"${ref.title}"`);
  if (ref.date) parts.push(`(${ref.date})`);
  parts.push(ref.url);
  return parts.join(". ") + ".";
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
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
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
              </div>
              <CopyButton
                text={formatCitation(ref)}
                label={`Copy citation for ${ref.id}`}
                className="shrink-0"
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
