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
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/50 bg-muted shadow-sm",
        className,
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={src}
        title={title}
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
  );
}
