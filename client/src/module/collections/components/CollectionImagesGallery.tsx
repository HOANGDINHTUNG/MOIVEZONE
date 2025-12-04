import { useState, useMemo } from "react";
import type { TMDBCollectionImagesResponse } from "../database/interface/collection";

interface Props {
  images: TMDBCollectionImagesResponse;
  imageBaseUrl: string;
}

const PAGE_SIZE = 20;
const BACKDROP_WINDOW = 5;
const POSTER_WINDOW = 6;

const CollectionImagesGallery = ({ images, imageBaseUrl }: Props) => {
  const { backdrops, posters } = images;

  const [loadedBackdropCount, setLoadedBackdropCount] = useState(
    Math.min(PAGE_SIZE, backdrops.length)
  );
  const [loadedPosterCount, setLoadedPosterCount] = useState(
    Math.min(PAGE_SIZE, posters.length)
  );

  const [backdropStartIndex, setBackdropStartIndex] = useState(0);
  const [posterStartIndex, setPosterStartIndex] = useState(0);

  const safeLoadedBackdropCount = Math.min(
    loadedBackdropCount,
    backdrops.length
  );
  const safeLoadedPosterCount = Math.min(loadedPosterCount, posters.length);

  const {
    loadedBackdrops,
    visibleBackdrops,
    atBackdropStart,
    atBackdropEndOfLoaded,
    canLoadMoreBackdrops,
  } = useMemo(() => {
    const loaded = backdrops.slice(0, safeLoadedBackdropCount);
    const windowSize = BACKDROP_WINDOW;

    const start = Math.min(
      backdropStartIndex,
      Math.max(loaded.length - windowSize, 0)
    );
    const end = start + windowSize;

    const visible = loaded.slice(start, end);

    const atStart = start === 0;
    const atEndOfLoaded = end >= loaded.length;
    const canLoadMore = safeLoadedBackdropCount < backdrops.length;

    return {
      loadedBackdrops: loaded,
      visibleBackdrops: visible,
      atBackdropStart: atStart,
      atBackdropEndOfLoaded: atEndOfLoaded,
      canLoadMoreBackdrops: canLoadMore,
    };
  }, [backdrops, safeLoadedBackdropCount, backdropStartIndex]);

  const {
    loadedPosters,
    visiblePosters,
    atPosterStart,
    atPosterEndOfLoaded,
    canLoadMorePosters,
  } = useMemo(() => {
    const loaded = posters.slice(0, safeLoadedPosterCount);
    const windowSize = POSTER_WINDOW;

    const start = Math.min(
      posterStartIndex,
      Math.max(loaded.length - windowSize, 0)
    );
    const end = start + windowSize;

    const visible = loaded.slice(start, end);

    const atStart = start === 0;
    const atEndOfLoaded = end >= loaded.length;
    const canLoadMore = safeLoadedPosterCount < posters.length;

    return {
      loadedPosters: loaded,
      visiblePosters: visible,
      atPosterStart: atStart,
      atPosterEndOfLoaded: atEndOfLoaded,
      canLoadMorePosters: canLoadMore,
    };
  }, [posters, safeLoadedPosterCount, posterStartIndex]);

  const handleBackdropPrev = () => {
    if (atBackdropStart) return;
    setBackdropStartIndex((prev) => Math.max(prev - BACKDROP_WINDOW, 0));
  };

  const handleBackdropNext = () => {
    if (!atBackdropEndOfLoaded) {
      setBackdropStartIndex((prev) =>
        Math.min(
          prev + BACKDROP_WINDOW,
          Math.max(loadedBackdrops.length - BACKDROP_WINDOW, 0)
        )
      );
      return;
    }

    if (canLoadMoreBackdrops) {
      setLoadedBackdropCount((prev) =>
        Math.min(prev + PAGE_SIZE, backdrops.length)
      );
    }
  };

  const handlePosterPrev = () => {
    if (atPosterStart) return;
    setPosterStartIndex((prev) => Math.max(prev - POSTER_WINDOW, 0));
  };

  const handlePosterNext = () => {
    if (!atPosterEndOfLoaded) {
      setPosterStartIndex((prev) =>
        Math.min(
          prev + POSTER_WINDOW,
          Math.max(loadedPosters.length - POSTER_WINDOW, 0)
        )
      );
      return;
    }

    if (canLoadMorePosters) {
      setLoadedPosterCount((prev) =>
        Math.min(prev + PAGE_SIZE, posters.length)
      );
    }
  };

  const showBackdropNav = backdrops.length > BACKDROP_WINDOW;
  const showPosterNav = posters.length > POSTER_WINDOW;

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Hình ảnh bộ sưu tập
      </h2>

      {/* BACKDROPS */}
      {backdrops.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Backdrops ({backdrops.length})
            </p>

            {showBackdropNav && (
              <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                <button
                  type="button"
                  onClick={handleBackdropPrev}
                  disabled={atBackdropStart}
                  className={`
                    px-2 py-1 rounded-full border transition
                    border-neutral-300 dark:border-neutral-600
                    ${
                      atBackdropStart
                        ? "opacity-30 cursor-default"
                        : "hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                    }
                  `}
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={handleBackdropNext}
                  disabled={!canLoadMoreBackdrops && atBackdropEndOfLoaded}
                  className={`
                    px-2 py-1 rounded-full border transition
                    border-neutral-300 dark:border-neutral-600
                    ${
                      !canLoadMoreBackdrops && atBackdropEndOfLoaded
                        ? "opacity-30 cursor-default"
                        : "hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                    }
                  `}
                >
                  {atBackdropEndOfLoaded && canLoadMoreBackdrops
                    ? "+ 20 ảnh nữa →"
                    : "→"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {visibleBackdrops.map((img) => (
              <div
                key={img.file_path}
                className="
                  aspect-video rounded-xl overflow-hidden
                  bg-neutral-200 dark:bg-neutral-800
                "
              >
                <img
                  src={imageBaseUrl + img.file_path}
                  alt="backdrop"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POSTERS */}
      {posters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Posters ({posters.length})
            </p>

            {showPosterNav && (
              <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                <button
                  type="button"
                  onClick={handlePosterPrev}
                  disabled={atPosterStart}
                  className={`
                    px-2 py-1 rounded-full border transition
                    border-neutral-300 dark:border-neutral-600
                    ${
                      atPosterStart
                        ? "opacity-30 cursor-default"
                        : "hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                    }
                  `}
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={handlePosterNext}
                  disabled={!canLoadMorePosters && atPosterEndOfLoaded}
                  className={`
                    px-2 py-1 rounded-full border transition
                    border-neutral-300 dark:border-neutral-600
                    ${
                      !canLoadMorePosters && atPosterEndOfLoaded
                        ? "opacity-30 cursor-default"
                        : "hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                    }
                  `}
                >
                  {atPosterEndOfLoaded && canLoadMorePosters
                    ? "+ 20 ảnh nữa →"
                    : "→"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {visiblePosters.map((img) => (
              <div
                key={img.file_path}
                className="
                  aspect-2/3 rounded-xl overflow-hidden
                  bg-neutral-200 dark:bg-neutral-800
                "
              >
                <img
                  src={imageBaseUrl + img.file_path}
                  alt="poster"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CollectionImagesGallery;
