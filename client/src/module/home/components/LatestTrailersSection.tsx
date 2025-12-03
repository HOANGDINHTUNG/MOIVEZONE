import { useMemo, useState } from "react";
import type { MovieSummary } from "../../movies/database/interface/movie";
import type { TvSummary } from "../../movies/database/interface/tv";

type TrailerItem = MovieSummary | TvSummary;

interface LatestTrailersSectionProps {
  popular?: TrailerItem[];
  inTheaters?: TrailerItem[];
  onPlay?: (item: TrailerItem) => void;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function isMovie(item: TrailerItem): item is MovieSummary {
  return (item as MovieSummary).title !== undefined;
}

function isTv(item: TrailerItem): item is TvSummary {
  return (item as TvSummary).name !== undefined;
}

const LatestTrailersSection = ({
  popular,
  inTheaters,
  onPlay,
}: LatestTrailersSectionProps) => {
  const popularItems = useMemo(() => popular ?? [], [popular]);
  const inTheatersItems = useMemo(() => inTheaters ?? [], [inTheaters]);

  const [activeTab, setActiveTab] = useState<"popular" | "inTheaters">(
    inTheatersItems.length ? "inTheaters" : "popular"
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
    if (isMovie(item)) return item.title;
    if (isTv(item)) return item.name;
    return "Untitled";
  };

  const getSubTitle = (item: TrailerItem): string => {
    if (isMovie(item)) return item.release_date ?? "";
    if (isTv(item)) return item.first_air_date ?? "";
    return "";
  };

  if (!popularItems.length && !inTheatersItems.length) return null;

  return (
    <section className="mt-10">
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
        {/* Gradient overlay */}
        <div className="absolute inset-0" />

        {/* Nội dung canh theo container để thẳng hàng Trending / Now Playing */}
        <div className="relative">
          <div className="container mx-auto px-4 py-6 md:px-8 md:py-8">
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
              <div className="flex items-center gap-1 rounded-full bg-black/40 p-1 text-xs md:text-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab("popular")}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    activeTab === "popular"
                      ? "bg-cyan-500/90 text-white shadow-md"
                      : "text-neutral-200/80 hover:bg-white/10"
                  }`}
                >
                  Popular
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("inTheaters")}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    activeTab === "inTheaters"
                      ? "bg-cyan-500/90 text-white shadow-md"
                      : "text-neutral-200/80 hover:bg-white/10"
                  }`}
                  disabled={!inTheatersItems.length}
                >
                  In Theaters
                </button>
              </div>
            </div>

            {/* Slider cards */}
            {items.length ? (
              <div
                className="overflow-x-auto pb-2 
                [-ms-overflow-style:none] [scrollbar-width:thin]
                [&::-webkit-scrollbar]:h-3
                [&::-webkit-scrollbar-track]:bg-black/60    /* track tối hơn */
                [&::-webkit-scrollbar-thumb]:bg-neutral-700 /* thumb đậm hơn */
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500
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
                      className="group relative flex w-[190px] shrink-0 flex-col md:w-[260px] lg:w-[300px] focus:outline-none"
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
                        <p className="line-clamp-2 text-sm font-semibold text-white md:text-base">
                          {getTitle(item)}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-200 md:text-xs">
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
