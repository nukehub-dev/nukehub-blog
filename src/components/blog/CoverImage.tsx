import { useState } from "react";
import { Image } from "@components/ui/Image";
import { ImageLightbox } from "@components/shared/ImageLightbox";

interface CoverImageProps {
  src: string;
  alt: string;
  fit?: "cover" | "contain" | "fill" | "none";
  transparent?: boolean;
}

/** Post cover image with the same click-to-expand lightbox as ImageFigure. */
export function CoverImage({
  src,
  alt,
  fit = "cover",
  transparent = false,
}: CoverImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block h-full w-full cursor-zoom-in"
        aria-label={`Enlarge image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          aspect="auto"
          rounded="none"
          fit={fit}
          transparent={transparent}
          loading="eager"
          wrapperClassName="h-full w-full"
        />
      </button>
      <ImageLightbox
        src={src}
        alt={alt}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
