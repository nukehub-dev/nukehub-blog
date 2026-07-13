import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.body.classList.add("overflow-hidden");
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", handleKey);
      return () => {
        document.body.classList.remove("overflow-hidden");
        document.removeEventListener("keydown", handleKey);
      };
    }
    document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <>
      <figure
        className={cn(
          "not-prose my-6 overflow-hidden rounded-md border border-border/50 bg-muted shadow-sm",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in"
          aria-label={`Enlarge image: ${alt}`}
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
        </button>
        {caption && (
          <figcaption className="border-t border-border/50 bg-card px-4 py-2 text-sm text-muted-foreground">
            {caption}
          </figcaption>
        )}
      </figure>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-4"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close image"
            >
              <X size={24} />
            </button>

            <img
              src={src}
              alt={alt}
              className="max-h-[85vh] max-w-full object-contain"
            />

            {caption && (
              <p className="max-w-2xl text-center text-sm text-white/80">
                {caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
