import { useEffect, useMemo, useRef, useState } from "react";
import type { TMDBMovieSummary } from "../../movies/database/interface/movie";

type TrailerItem = TMDBMovieSummary;

interface LatestTrailersSectionProps {
  popular?: TMDBMovieSummary[];
  inTheaters?: TMDBMovieSummary[];
  onPlay?: (item: TMDBMovieSummary) => void;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

const LatestTrailersSection = ({
  popular,
  inTheaters,
  onPlay,
}: LatestTrailersSectionProps) => {
  const popularItems = useMemo(() => popular ?? [], [popular]);
  const inTheatersItems = useMemo(() => inTheaters ?? [], [inTheaters]);

  const hasInTheaters = (inTheaters?.length ?? 0) > 0;

  const [activeTab, setActiveTab] = useState<"popular" | "inTheaters">(
    hasInTheaters ? "inTheaters" : "popular"
  );

  const items = activeTab === "popular" ? popularItems : inTheatersItems;

  const defaultBackdrop = useMemo(() => {
    if (!items.length) return null;
    const first = items[0];
    return first.backdrop_path || first.poster_path || null;
  }, [items]);

  const [hoverBackdrop, setHoverBackdrop] = useState<string | null>(null);

  const activeBackdrop = hoverBackdrop ?? defaultBackdrop;

  const getTitle = (item: TrailerItem): string => {
    return item.title || "Untitled";
  };

  const getSubTitle = (item: TrailerItem): string => {
    return item.release_date ?? "";
  };

  // ===== Tabs indicator refs + style (auto fit theo button) =====
  const popularRef = useRef<HTMLButtonElement | null>(null);
  const theatersRef = useRef<HTMLButtonElement | null>(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });

  useEffect(() => {
    let target: HTMLButtonElement | null = null;

    if (activeTab === "popular") {
      target = popularRef.current;
    } else {
      // Nếu tab inTheaters nhưng không có data -> fallback về Popular
      target = inTheatersItems.length
        ? theatersRef.current
        : popularRef.current;
    }

    if (target) {
      setIndicatorStyle({
        width: target.offsetWidth,
        left: target.offsetLeft,
      });
    }
  }, [activeTab, popularItems.length, inTheatersItems.length]);

  if (!popularItems.length && !inTheatersItems.length) return null;

  return (
    <section className="mt-8 md:mt-10">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950">
        {/* Backdrop full width */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: activeBackdrop
              ? `url(${IMAGE_BASE}${activeBackdrop})`
              : undefined,
            opacity: activeBackdrop ? 0.5 : 0,
          }}
        />
        {/* Gradient overlay nếu cần (hiện giờ chỉ để tối nền) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/60" />

        {/* Nội dung canh theo container để thẳng hàng Trending / Now Playing */}
        <div className="relative">
          <div className="container mx-auto px-3 py-5 sm:px-4 sm:py-6 md:px-8 md:py-8">
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold tracking-tight text-white">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  Latest Trailers
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-300">
                  Hover vào trailer để phông nền đổi theo backdrop của phim.
                </p>
              </div>

              {/* Tabs: Popular / In Theaters */}
              <div className="relative flex items-center gap-1 rounded-full bg-black/40 p-1 text-[11px] sm:text-xs md:text-sm">
                {/* Thanh highlight trượt mượt + gradient đỏ → vàng */}
                <div
                  className="absolute top-1 bottom-1 rounded-full bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 shadow-lg transition-all duration-300 ease-out"
                  style={{
                    width: indicatorStyle.width,
                    left: indicatorStyle.left,
                  }}
                />

                {/* POPULAR BTN */}
                <button
                  ref={popularRef}
                  type="button"
                  onClick={() => setActiveTab("popular")}
                  className={`
                    relative z-10 rounded-full px-3 py-1 font-semibold transition-colors duration-300
                    ${
                      activeTab === "popular"
                        ? "text-black"
                        : "text-neutral-200/80 hover:text-white"
                    }
                  `}
                >
                  Popular
                </button>

                {/* IN THEATERS BTN */}
                <button
                  ref={theatersRef}
                  type="button"
                  onClick={() => setActiveTab("inTheaters")}
                  disabled={!inTheatersItems.length}
                  className={`
                    relative z-10 rounded-full px-3 py-1 font-semibold transition-colors duration-300
                    ${
                      activeTab === "inTheaters"
                        ? "text-black"
                        : "text-neutral-200/80 hover:text-white"
                    }
                    ${
                      !inTheatersItems.length
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  In Theaters
                </button>
              </div>
            </div>

            {/* Slider cards */}
            {items.length ? (
              <div
                className=" -mx-3 sm:mx-0 overflow-x-auto px-3 sm:px-4 pb-3
                            [&::-webkit-scrollbar]:h-1.5
                            [&::-webkit-scrollbar-track]:bg-neutral-900/80
                            [&::-webkit-scrollbar-thumb]:bg-neutral-700
                            [&::-webkit-scrollbar-thumb]:rounded-full
                          "
              >
                <div className="flex min-w-fit gap-4 md:gap-6">
                  {items.slice(0, 10).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() =>
                        setHoverBackdrop(
                          item.backdrop_path || item.poster_path || null
                        )
                      }
                      onMouseLeave={() => setHoverBackdrop(null)}
                      onClick={() => onPlay?.(item)}
                      className="group relative flex w-[170px] sm:w-[190px] md:w-60 lg:w-[280px] shrink-0 flex-col focus:outline-none"
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 shadow-lg">
                        <div className="relative pb-[56.25%]">
                          {item.backdrop_path || item.poster_path ? (
                            <img
                              src={`${IMAGE_BASE}${
                                item.backdrop_path || item.poster_path
                              }`}
                              alt={getTitle(item)}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400">
                              No image
                            </div>
                          )}

                          {/* Play icon */}
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur group-hover:bg-black/80">
                              <div className="ml-0.5 border-l-12 border-y-[7px] border-l-white border-y-transparent" />
                            </div>
                          </div>

                          {/* Dots */}
                          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/90 text-white/80">
                            <span className="text-lg leading-none">⋯</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-left">
                        <p className="line-clamp-2 text-xs sm:text-sm font-semibold text-white md:text-base">
                          {getTitle(item)}
                        </p>
                        <p className="mt-1 text-[10px] sm:text-[11px] text-neutral-200 md:text-xs">
                          {getSubTitle(item)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-300">
                Không có trailer cho tab hiện tại.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestTrailersSection;
export type { TrailerItem };
