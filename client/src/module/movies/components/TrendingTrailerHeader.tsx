// src/module/movies/components/TrendingTrailerHeader.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";

import { tmdbTrendingApi } from "../../../api/movie/TMDBTrending.api";

import type {
  TMDBTrendingMovieItem,
  TMDBTrendingTvItem,
} from "../../trending/database/interface/trending";
import { tmdbMoviesApi } from "../../../api/movie/TMDBMovie.api";
import { tmdbTvApi } from "../../../api/movie/TMDBTv.api";

type BaseTrendingItem = TMDBTrendingMovieItem | TMDBTrendingTvItem;

type TMDBVideoItem = {
  key: string;
  site: string;
  type: string;
};

type TrailerItem = BaseTrendingItem & {
  trailerKey: string;
};

interface TrendingTrailerHeaderProps {
  mode: "movie" | "tv";
}

const MAX_TRAILERS = 5;
const TRAILER_DURATION = 25; // giây

const TrendingTrailerHeader = ({ mode }: TrendingTrailerHeaderProps) => {
  const language = useAppSelector((state) => state.language.current);

  const [trailers, setTrailers] = useState<TrailerItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Helpers cho title / năm / backdrop
  const getTitle = (item: BaseTrendingItem) => {
    if (mode === "movie") {
      const m = item as TMDBTrendingMovieItem;
      return m.title || m.original_title;
    }
    const tv = item as TMDBTrendingTvItem;
    return tv.name || tv.original_name;
  };

  const getYear = (item: BaseTrendingItem): number | null => {
    if (mode === "movie") {
      const m = item as TMDBTrendingMovieItem;
      if (!m.release_date) return null;
      return new Date(m.release_date).getFullYear();
    }
    const tv = item as TMDBTrendingTvItem;
    if (!tv.first_air_date) return null;
    return new Date(tv.first_air_date).getFullYear();
  };

  const getBackdropUrl = (item: BaseTrendingItem): string | undefined => {
    if (item.backdrop_path) {
      return `https://image.tmdb.org/t/p/original${item.backdrop_path}`;
    }
    if (item.poster_path) {
      return `https://image.tmdb.org/t/p/original${item.poster_path}`;
    }
    return undefined;
  };

  // Load danh sách trending + trailer
  useEffect(() => {
    let cancelled = false;

    const fetchTrailers = async () => {
      try {
        setLoading(true);

        const trending = await tmdbTrendingApi.getTrendingAll("day");

        const filtered = trending.results.filter(
          (item): item is BaseTrendingItem => item.media_type === mode
        );

        // Ưu tiên vote cao + có backdrop
        filtered.sort(
          (a, b) =>
            (b.vote_average ?? 0) - (a.vote_average ?? 0) ||
            (b.backdrop_path ? 1 : 0) - (a.backdrop_path ? 1 : 0)
        );

        const result: TrailerItem[] = [];

        for (const item of filtered) {
          if (result.length >= MAX_TRAILERS) break;

          try {
            const videos =
              mode === "movie"
                ? await tmdbMoviesApi.getMovieVideos(item.id, language)
                : await tmdbTvApi.getTvVideos(item.id, language);

            const trailer = videos.results.find(
              (v: TMDBVideoItem) =>
                v.site === "YouTube" &&
                (v.type === "Trailer" || v.type === "Teaser")
            );

            if (trailer) {
              result.push({
                ...item,
                trailerKey: trailer.key,
              });
            }
          } catch (err) {
            console.error("Load videos error", err);
          }
        }

        if (!cancelled) {
          setTrailers(result);
          setActiveIndex(0);
        }
      } catch (err) {
        console.error("Fetch trending trailers error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTrailers();

    return () => {
      cancelled = true;
    };
  }, [language, mode]);

  // Auto chuyển trailer
  useEffect(() => {
    if (!trailers.length) return;

    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % trailers.length);
    }, TRAILER_DURATION * 1000);

    return () => clearTimeout(timer);
  }, [trailers, activeIndex]);

  if (loading && !trailers.length) {
    return (
      <div className="w-full bg-black">
        <div className="mx-auto max-w-6xl px-3 py-4 sm:py-6">
          <div className="h-32 sm:h-40 animate-pulse rounded-xl bg-neutral-800" />
        </div>
      </div>
    );
  }

  if (!trailers.length) return null;

  const current = trailers[activeIndex];

  const year = getYear(current);
  const vote = current.vote_average
    ? Math.round(current.vote_average * 10) / 10
    : null;
  const title = getTitle(current);
  const backdropUrl = getBackdropUrl(current);

  const youtubeSrc = `https://www.youtube.com/embed/${
    current.trailerKey
  }?autoplay=1&mute=${
    isMuted ? 1 : 0
  }&controls=0&rel=0&showinfo=0&modestbranding=1&loop=1&playlist=${
    current.trailerKey
  }`;

  const detailPath =
    mode === "movie" ? `/movie/${current.id}` : `/tv/${current.id}`;

  const handleNext = () => {
    if (!trailers.length) return;
    setActiveIndex((prev) => (prev + 1) % trailers.length);
  };

  const handlePrev = () => {
    if (!trailers.length) return;
    setActiveIndex((prev) => (prev === 0 ? trailers.length - 1 : prev - 1));
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <header className="relative w-full bg-black text-white overflow-hidden">
      <div className="relative w-full">
        {/* Video full chiều ngang - giữ tỉ lệ 16:9 */}
        <div className="relative w-full aspect-video overflow-hidden">
          {/* VIDEO / YOUTUBE (disable click trực tiếp) */}
          <div className="absolute inset-0 pointer-events-none">
            <iframe
              className="h-full w-full"
              src={youtubeSrc}
              title={title}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Overlay chỉ ở NỬA DƯỚI để làm tối chỗ title */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black via-black/70 to-transparent" />

          {/* Info + controls */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end px-3 pb-3 pt-6 sm:px-4 sm:pb-4 md:px-8 md:pb-6">
            <div className="max-w-sm space-y-1.5 sm:max-w-md sm:space-y-2 md:max-w-xl md:space-y-3">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] md:text-xs text-neutral-300">
                {year && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5">
                    {year}
                  </span>
                )}
                {vote && (
                  <span className="rounded-full bg-red-500/90 px-2 py-0.5 font-semibold text-[10px] sm:text-[11px]">
                    ★ {vote} / 10
                  </span>
                )}
                {current.original_language && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 uppercase">
                    {current.original_language}
                  </span>
                )}
                <span className="rounded-full bg-white/5 px-2 py-0.5">
                  Trailer {activeIndex + 1}/{trailers.length}
                </span>
              </div>

              <h1 className="text-base font-bold tracking-tight sm:text-xl md:text-3xl lg:text-4xl">
                {title}
              </h1>

              {current.overview && (
                <p className="line-clamp-2 text-[11px] text-neutral-200 sm:line-clamp-3 sm:text-xs md:text-sm">
                  {current.overview}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Link
                  to={detailPath}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_20px_rgba(248,113,113,0.7)] transition hover:bg-red-500"
                >
                  Xem chi tiết
                  <span className="text-base leading-none sm:text-lg">›</span>
                </Link>

                {backdropUrl && (
                  <a
                    href={backdropUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-medium text-neutral-100 backdrop-blur hover:bg-white/20"
                  >
                    Xem ảnh nền
                  </a>
                )}
              </div>
            </div>

            {/* === THANH CONTROL Ở DƯỚI: dots + mute + prev/next === */}
            <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4 sm:gap-4">
              {/* Dots progress */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {trailers.map((_, idx) => (
                  <span
                    key={idx}
                    className={
                      "h-1.5 rounded-full transition-all " +
                      (idx === activeIndex
                        ? "w-4 bg-white"
                        : "w-2 bg-neutral-500/60")
                    }
                  />
                ))}
              </div>

              {/* Controls góc dưới bên phải */}
              <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 md:gap-3">
                {/* Mute */}
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-[11px] sm:h-8 sm:w-8 sm:text-xs md:h-9 md:w-9 border border-white/40 hover:bg-black/90"
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>

                {/* Prev / Next */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm sm:h-8 sm:w-8 sm:text-base md:h-9 md:w-9 border border-white/40 hover:bg-black/90"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm sm:h-8 sm:w-8 sm:text-base md:h-9 md:w-9 border border-white/40 hover:bg-black/90"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dòng nhỏ dưới video */}
        <div className="flex flex-col gap-1 border-t border-neutral-800/60 bg-linear-to-r from-black/80 via-black/60 to-black/80 px-3 py-2 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:text-[11px] md:px-5 md:text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-300">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="font-semibold uppercase tracking-wide text-neutral-200">
              Đang phát trailer:
            </span>
            <span className="line-clamp-1 text-neutral-100">{title}</span>
          </div>
          <div className="text-neutral-400 text-[10px] sm:text-[11px] hidden xs:block">
            Tự chuyển sau ~{TRAILER_DURATION}s
          </div>
        </div>
      </div>
    </header>
  );
};

export default TrendingTrailerHeader;
