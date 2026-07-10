import { cn } from "@lib/utils";

interface OdyseeProps {
  /** Full Odysee embed URL, e.g. https://odysee.com/$/embed/name/claimId */
  url?: string;
  /** Odysee claim name (used with claimId). */
  claimName?: string;
  /** Odysee claim ID (used with claimName). */
  claimId?: string;
  title?: string;
  className?: string;
}

export function Odysee({
  url,
  claimName,
  claimId,
  title = "Odysee video",
  className,
}: OdyseeProps) {
  let src = url;
  if (!src && claimName && claimId) {
    src = `https://odysee.com/$/embed/${encodeURIComponent(claimName)}/${encodeURIComponent(claimId)}`;
  }

  if (!src) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border/50 bg-muted p-4 text-sm text-muted-foreground",
          className,
        )}
      >
        Missing Odysee video URL or claimName + claimId.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-muted shadow-sm",
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
