import { useMemo } from "react";
import type {
  TMDBCollectionDetailsResponse,
  TMDBCollectionImagesResponse,
  TMDBCollectionTranslation,
  TMDBImage,
} from "../database/interface/collection";

interface CollectionHeroProps {
  collection: TMDBCollectionDetailsResponse;
  images?: TMDBCollectionImagesResponse;
  imageBaseUrl: string;

  translations?: TMDBCollectionTranslation[];
  activeLanguage?: string;
}

const pickBestBackdrop = (
  images?: TMDBCollectionImagesResponse
): TMDBImage | null => {
  if (!images || !images.backdrops.length) return null;

  const backdrops = images.backdrops;
  const sorted = [...backdrops].sort((a, b) => b.vote_average - a.vote_average);

  return sorted[0] ?? null;
};

const pickBestTranslation = (
  translations: TMDBCollectionTranslation[] | undefined,
  lang?: string
): TMDBCollectionTranslation | undefined => {
  if (!translations || translations.length === 0) return undefined;

  if (lang) {
    const exact = translations.find((t) => t.iso_639_1 === lang);
    if (exact && (exact.data.title || exact.data.overview)) return exact;
  }

  const en = translations.find((t) => t.iso_639_1 === "en");
  if (en && (en.data.title || en.data.overview)) return en;

  const withOverview = translations.find(
    (t) => t.data.overview && t.data.overview.trim() !== ""
  );
  if (withOverview) return withOverview;

  return translations[0];
};

const CollectionHero = ({
  collection,
  images,
  imageBaseUrl,
  translations,
  activeLanguage,
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

  const bestTranslation = useMemo(
    () => pickBestTranslation(translations, activeLanguage),
    [translations, activeLanguage]
  );

  const displayTitle = bestTranslation?.data.title || name;
  const displayOverview = bestTranslation?.data.overview || overview;
  const displayTagline = bestTranslation?.data.tagline || "";

  return (
    <section
      className="
        relative rounded-2xl overflow-hidden
        bg-neutral-200 dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-100
      "
    >
      {backdropPath && (
        <div className="absolute inset-0">
          <img
            src={imageBaseUrl + backdropPath}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/40" />
        </div>
      )}

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-10 flex gap-6 md:gap-8">
        {poster_path && (
          <div className="hidden sm:block shrink-0">
            <div
              className="
                w-32 md:w-40 rounded-xl overflow-hidden
                shadow-2xl shadow-black/60
                border border-white/10 dark:border-neutral-700
              "
            >
              <img
                src={imageBaseUrl + poster_path}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-red-500 dark:text-red-400">
              Bộ sưu tập
            </p>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-white">
              {displayTitle}
            </h1>

            {displayTagline && (
              <p className="text-sm italic mt-1 text-neutral-200">
                {displayTagline}
              </p>
            )}

            {total > 0 && (
              <p className="mt-1 text-sm text-neutral-200">
                Gồm <span className="font-semibold text-white">{total}</span>{" "}
                phim
                {firstYear &&
                  ` (${firstYear}${
                    lastYear && lastYear !== firstYear ? ` - ${lastYear}` : ""
                  })`}
              </p>
            )}
          </div>

          {displayOverview && (
            <p className="text-sm md:text-base text-neutral-200 max-w-2xl line-clamp-4 md:line-clamp-5">
              {displayOverview}
            </p>
          )}

          {bestTranslation && (
            <p className="text-xs text-neutral-300">
              Ngôn ngữ mô tả: {bestTranslation.english_name} (
              {bestTranslation.iso_639_1})
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollectionHero;
