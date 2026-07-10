import { cn } from "@lib/utils";

interface VideoProps {
  src: string;
  title?: string;
  poster?: string;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

export function Video({
  src,
  title,
  poster,
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  className,
}: VideoProps) {
  return (
    <figure className={cn("my-6", className)}>
      <div className="overflow-hidden rounded-xl border border-border/50 bg-muted shadow-sm">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={src}
          poster={poster}
          controls={controls}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          playsInline
          className="w-full"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      {title && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {title}
        </figcaption>
      )}
    </figure>
  );
}
