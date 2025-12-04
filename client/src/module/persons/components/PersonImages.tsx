import { useMemo } from "react";
import type { TMDBPersonImage, TMDBPersonImagesResponse, TMDBPersonTaggedImage, TMDBPersonTaggedImagesResponse } from "../database/interface/person";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface PersonImagesProps {
  images?: TMDBPersonImagesResponse;
  taggedImages?: TMDBPersonTaggedImagesResponse;
}

const PersonImages = ({ images, taggedImages }: PersonImagesProps) => {
  const topImages: TMDBPersonImage[] = useMemo(() => {
    if (!images) return [];
    return [...images.profiles]
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 12);
  }, [images]);

  const topTaggedImages: TMDBPersonTaggedImage[] = useMemo(() => {
    if (!taggedImages) return [];
    return [...taggedImages.results]
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 12);
  }, [taggedImages]);

  return (
    <section id="images" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight md:text-2xl">
          Images
        </h2>
        <span className="text-xs text-neutral-400">
          Profiles: {images?.profiles.length ?? 0} · Tagged:{" "}
          {taggedImages?.total_results ?? 0}
        </span>
      </div>

      {/* Profile images */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Profile Images
        </h3>
        {topImages.length ? (
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {topImages.map((img) => (
              <div
                key={img.file_path}
                className="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60"
              >
                <img
                  src={`${IMAGE_BASE}/w300${img.file_path}`}
                  alt="profile"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Không có profile image.</p>
        )}
      </div>

      {/* Tagged images */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Tagged Images
        </h3>
        {topTaggedImages.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {topTaggedImages.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60"
              >
                <img
                  src={`${IMAGE_BASE}/w300${img.file_path}`}
                  alt="tagged"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-neutral-200">
                  <span className="rounded-full bg-neutral-900/80 px-2 py-1">
                    {img.media.media_type}
                  </span>
                  <span className="rounded-full bg-neutral-900/80 px-2 py-1">
                    Votes: {img.vote_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Không có tagged image.</p>
        )}
      </div>
    </section>
  );
};

export default PersonImages;
