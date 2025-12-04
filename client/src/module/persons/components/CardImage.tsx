import { memo } from "react";

interface CardImageProps {
  src?: string;
  alt: string;
}

const CardImage = memo(function CardImage({ src, alt }: CardImageProps) {
  if (!src) {
    return (
      <div className="flex h-56 w-full items-center justify-center bg-neutral-900 text-[11px] text-neutral-500 md:h-64">
        No Image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-64"
    />
  );
});

export default CardImage;
