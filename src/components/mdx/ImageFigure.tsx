import { cn } from "@lib/utils";
import { Image } from "@components/ui/Image";

interface ImageFigureProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectRatio?: string;
  fit?: "cover" | "contain";
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
  transparent?: boolean;
}

export function ImageFigure({
  src,
  alt,
  caption,
  className,
  aspectRatio,
  fit = "cover",
  rounded = "none",
  transparent = false,
}: ImageFigureProps) {
  return (
    <figure
      className={cn(
        "not-prose my-6 overflow-hidden rounded-xl border border-border/50 bg-muted shadow-sm",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        aspect="auto"
        rounded={rounded}
        fit={fit}
        loading="eager"
        transparent={transparent}
        fill={Boolean(aspectRatio)}
        wrapperClassName="w-full"
        wrapperStyle={aspectRatio ? { aspectRatio } : undefined}
        className="w-full"
      />
      {caption && (
        <figcaption className="border-t border-border/50 bg-card px-4 py-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
