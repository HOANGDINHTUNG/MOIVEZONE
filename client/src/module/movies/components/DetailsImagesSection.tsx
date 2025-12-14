import React from "react";
import type {
  TMDBMovieImagesResponse,
  TMDBMediaImage as TMDBMovieImage,
} from "../database/interface/movie";
import type {
  TMDBTvImagesResponse,
  TMDBMediaImage as TMDBTvImage,
} from "../database/interface/tv";

type MediaImages = TMDBMovieImagesResponse | TMDBTvImagesResponse;
type MediaImage = TMDBMovieImage | TMDBTvImage;

interface DetailsImagesSectionProps {
  images: MediaImages;
  imageBaseUrl: string;
}

const ImagesRow: React.FC<{
  title: string;
  items: MediaImage[];
  imageBaseUrl: string;
}> = ({ title, items, imageBaseUrl }) => {
  if (!items.length) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-neutral-200">{title}</h3>
      <div className="-mx-3 overflow-x-auto px-3 pb-1">
        <div className="flex gap-2">
          {items.map((img) => (
            <div
              key={img.file_path}
              className="relative h-32 w-56 shrink-0 overflow-hidden rounded-lg bg-neutral-900"
            >
              <img
                src={`${imageBaseUrl}/w500${img.file_path}`}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailsImagesSection: React.FC<DetailsImagesSectionProps> = ({
  images,
  imageBaseUrl,
}) => {
  const { backdrops = [], posters = [], logos = [] } = images;

  if (!backdrops.length && !posters.length && !logos.length) return null;

  return (
    <section aria-label="Images" className="rounded-xl bg-neutral-900/60 p-4">
      <h2 className="mb-3 border-b border-neutral-800 pb-2 text-sm font-semibold uppercase tracking-wide text-neutral-200">
        Images
      </h2>

      <div className="space-y-4">
        <ImagesRow
          title="Backdrops"
          items={backdrops}
          imageBaseUrl={imageBaseUrl}
        />
        <ImagesRow
          title="Posters"
          items={posters}
          imageBaseUrl={imageBaseUrl}
        />
        <ImagesRow title="Logos" items={logos} imageBaseUrl={imageBaseUrl} />
      </div>
    </section>
  );
};

export default DetailsImagesSection;
