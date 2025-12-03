import { useMemo, useState } from "react";
import type { MovieSummary } from "../../movies/database/interface/movie";
import type { TvSummary } from "../../movies/database/interface/tv";

type TrailerItem = MovieSummary | TvSummary;

interface LatestTrailersSectionProps {
  data?: TrailerItem[];
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function isMovie(item: TrailerItem): item is MovieSummary {
  return (item as MovieSummary).title !== undefined;
}

function isTv(item: TrailerItem): item is TvSummary {
  return (item as TvSummary).name !== undefined;
}

const LatestTrailersSection = ({ data }: LatestTrailersSectionProps) => {
  const items = useMemo(() => data ?? [], [data]);

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

  if (!items.length) return null;

  return (
    <section className="mt-10">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: activeBackdrop
              ? `url(${IMAGE_BASE}${activeBackdrop})`
              : undefined,
            opacity: activeBackdrop ? 0.6 : 0,
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-r" />

        <div className="relative px-4 py-6 md:px-8 md:py-8">
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

            <div className="flex items-center gap-2 rounded-full bg-black/40 p-1 text-xs md:text-sm">
              <button className="rounded-full bg-cyan-500/90 px-3 py-1 font-medium text-white">
                Popular
              </button>
              <button className="rounded-full px-3 py-1 font-medium text-neutral-200/80">
                In Theaters
              </button>
            </div>
          </div>

          {/* Cards */}
          <div
            className="-mx-4 overflow-x-auto px-4 pb-2 
                        [&::-webkit-scrollbar]:h-2
                        [&::-webkit-scrollbar-track]:bg-black/40
                        [&::-webkit-scrollbar-thumb]:bg-neutral-600/90
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
        </div>
      </div>
    </section>
  );
};

export default LatestTrailersSection;
