import { cn } from "@lib/utils";

interface YouTubeProps {
  id: string;
  title?: string;
  start?: number;
  className?: string;
}

export function YouTube({
  id,
  title = "YouTube video",
  start,
  className,
}: YouTubeProps) {
  const params = new URLSearchParams({ rel: "0" });
  if (start) params.set("start", String(start));
  const src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;

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
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
