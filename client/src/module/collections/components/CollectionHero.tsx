import { useMemo } from "react";
import type { TMDBCollectionDetailsResponse, TMDBCollectionImagesResponse, TMDBImage } from "../database/interface/collection";

interface CollectionHeroProps {
  collection: TMDBCollectionDetailsResponse;
  images?: TMDBCollectionImagesResponse;
  imageBaseUrl: string;
}

const pickBestBackdrop = (
  images?: TMDBCollectionImagesResponse
): TMDBImage | null => {
  if (!images || !images.backdrops.length) return null;

  // Ưu tiên backdrop có ngôn ngữ hiện tại / hoặc không ngôn ngữ
  const backdrops = images.backdrops;

  // Có thể filter theo iso_639_1 nếu muốn,
  // tạm thời ưu tiên vote cao
  const sorted = [...backdrops].sort((a, b) => b.vote_average - a.vote_average);

  return sorted[0] ?? null;
};

const CollectionHero = ({
  collection,
  images,
  imageBaseUrl,
}: CollectionHeroProps) => {
  const { name, overview, backdrop_path, poster_path, parts } = collection;

  const bestBackdrop = useMemo(() => pickBestBackdrop(images), [images]);

  const backdropPath = bestBackdrop?.file_path || backdrop_path || poster_path;

  const { total, firstYear, lastYear } = useMemo(() => {
    const sorted = [...parts].sort((a, b) =>
      (a.release_date || "").localeCompare(b.release_date || "")
    );
    const totalParts = parts.length;

    const first = sorted[0]?.release_date ?? "";
    const last = sorted[sorted.length - 1]?.release_date ?? "";

    const firstYear = first ? first.slice(0, 4) : undefined;
    const lastYear = last ? last.slice(0, 4) : undefined;

    return { total: totalParts, firstYear, lastYear };
  }, [parts]);

  return (
    <section className="relative rounded-2xl overflow-hidden bg-neutral-900">
      {/* Background image ưu tiên từ /images */}
      {backdropPath && (
        <div className="absolute inset-0">
          <img
            src={imageBaseUrl + backdropPath}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/40" />
        </div>
      )}

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-10 flex gap-6 md:gap-8">
        {poster_path && (
          <div className="hidden sm:block shrink-0">
            <div className="w-32 md:w-40 rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10">
              <img
                src={imageBaseUrl + poster_path}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-red-400">
              Bộ sưu tập
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {name}
            </h1>

            {total > 0 && (
              <p className="mt-1 text-sm text-neutral-300">
                Gồm <span className="font-semibold text-white">{total}</span>{" "}
                phim
                {firstYear &&
                  ` (${firstYear}${
                    lastYear && lastYear !== firstYear ? ` - ${lastYear}` : ""
                  })`}
              </p>
            )}
          </div>

          {overview && (
            <p className="text-sm md:text-base text-neutral-200 max-w-2xl line-clamp-4 md:line-clamp-5">
              {overview}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollectionHero;
