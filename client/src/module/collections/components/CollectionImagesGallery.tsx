// src/module/collections/components/CollectionImagesGallery.tsx

import { useState, useMemo } from "react";
import type { TMDBCollectionImagesResponse } from "../database/interface/collection";

interface Props {
  images: TMDBCollectionImagesResponse;
  imageBaseUrl: string;
}

const PAGE_SIZE = 20;

// Mỗi lần hiển thị tối đa 5 backdrops và 6 posters
const BACKDROP_WINDOW = 5;
const POSTER_WINDOW = 6;

const CollectionImagesGallery = ({ images, imageBaseUrl }: Props) => {
  const { backdrops, posters } = images;

  // Số ảnh đã "load" vào carousel (ban đầu: tối đa 20)
  const [loadedBackdropCount, setLoadedBackdropCount] = useState(
    Math.min(PAGE_SIZE, backdrops.length)
  );
  const [loadedPosterCount, setLoadedPosterCount] = useState(
    Math.min(PAGE_SIZE, posters.length)
  );

  // Vị trí bắt đầu của "cửa sổ" hiển thị
  const [backdropStartIndex, setBackdropStartIndex] = useState(0);
  const [posterStartIndex, setPosterStartIndex] = useState(0);

  // Clamp để tránh vượt độ dài mảng nếu images thay đổi
  const safeLoadedBackdropCount = Math.min(
    loadedBackdropCount,
    backdrops.length
  );
  const safeLoadedPosterCount = Math.min(loadedPosterCount, posters.length);

  // BACKDROPS: tính ra subset đang load + subset đang hiển thị (window)
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

  // POSTERS
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

  // ===== HANDLER: BACKDROPS =====
  const handleBackdropPrev = () => {
    if (atBackdropStart) return;
    setBackdropStartIndex((prev) => Math.max(prev - BACKDROP_WINDOW, 0));
  };

  const handleBackdropNext = () => {
    // Còn cửa sổ phía sau trong phần đã load → trượt
    if (!atBackdropEndOfLoaded) {
      setBackdropStartIndex((prev) =>
        Math.min(
          prev + BACKDROP_WINDOW,
          Math.max(loadedBackdrops.length - BACKDROP_WINDOW, 0)
        )
      );
      return;
    }

    // Đã tới cuối phần load nhưng còn ảnh chưa load → load thêm 20
    if (canLoadMoreBackdrops) {
      setLoadedBackdropCount((prev) =>
        Math.min(prev + PAGE_SIZE, backdrops.length)
      );
    }
  };

  // ===== HANDLER: POSTERS =====
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
      <h2 className="text-lg font-semibold text-white">Hình ảnh bộ sưu tập</h2>

      {/* BACKDROPS */}
      {backdrops.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-neutral-400">
              Backdrops ({backdrops.length})
            </p>

            {showBackdropNav && (
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <button
                  type="button"
                  onClick={handleBackdropPrev}
                  disabled={atBackdropStart}
                  className={`px-2 py-1 rounded-full border border-neutral-600 transition ${
                    atBackdropStart
                      ? "opacity-30 cursor-default"
                      : "hover:bg-neutral-700 cursor-pointer"
                  }`}
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={handleBackdropNext}
                  disabled={!canLoadMoreBackdrops && atBackdropEndOfLoaded}
                  className={`px-2 py-1 rounded-full border border-neutral-600 transition ${
                    !canLoadMoreBackdrops && atBackdropEndOfLoaded
                      ? "opacity-30 cursor-default"
                      : "hover:bg-neutral-700 cursor-pointer"
                  }`}
                >
                  {atBackdropEndOfLoaded && canLoadMoreBackdrops
                    ? "+ 20 ảnh nữa →"
                    : "→"}
                </button>
              </div>
            )}
          </div>

          {/* grid 5 cột (tuỳ theo màn hình) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {visibleBackdrops.map((img) => (
              <div
                key={img.file_path}
                className="aspect-video rounded-xl overflow-hidden bg-neutral-800"
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
            <p className="text-xs text-neutral-400">
              Posters ({posters.length})
            </p>

            {showPosterNav && (
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <button
                  type="button"
                  onClick={handlePosterPrev}
                  disabled={atPosterStart}
                  className={`px-2 py-1 rounded-full border border-neutral-600 transition ${
                    atPosterStart
                      ? "opacity-30 cursor-default"
                      : "hover:bg-neutral-700 cursor-pointer"
                  }`}
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={handlePosterNext}
                  disabled={!canLoadMorePosters && atPosterEndOfLoaded}
                  className={`px-2 py-1 rounded-full border border-neutral-600 transition ${
                    !canLoadMorePosters && atPosterEndOfLoaded
                      ? "opacity-30 cursor-default"
                      : "hover:bg-neutral-700 cursor-pointer"
                  }`}
                >
                  {atPosterEndOfLoaded && canLoadMorePosters
                    ? "+ 20 ảnh nữa →"
                    : "→"}
                </button>
              </div>
            )}
          </div>

          {/* grid 6 cột (tuỳ theo màn hình) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {visiblePosters.map((img) => (
              <div
                key={img.file_path}
                className="aspect-2/3 rounded-xl overflow-hidden bg-neutral-800"
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
