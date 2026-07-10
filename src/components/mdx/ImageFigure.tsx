import { cn } from "@lib/utils";

interface ImageFigureProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function ImageFigure({
  src,
  alt,
  caption,
  className,
}: ImageFigureProps) {
  return (
    <figure
      className={cn(
        "my-6 overflow-hidden rounded-xl border border-border/50 bg-muted shadow-sm",
        className,
      )}
    >
      <img src={src} alt={alt} loading="lazy" className="w-full object-cover" />
      {caption && (
        <figcaption className="border-t border-border/50 bg-card px-4 py-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
