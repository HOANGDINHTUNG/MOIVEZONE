// src/module/movies/components/ExploreBackdropHeader.tsx
import { useEffect, useState } from "react";
import type {
  TMDBListResponse,
  TMDBMediaBase,
} from "../database/interface/movieLists";
import axiosTMDB from "../../../app/axiosTMDB";

type BackdropItem = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  backdrop_path: string;
  rating: number;
  popularity: number;
  releaseYear: string;
};

type DiscoverMovieItem = TMDBMediaBase & {
  title?: string;
  original_title?: string;
  release_date?: string;
  popularity?: number;
};

type DiscoverTvItem = TMDBMediaBase & {
  name?: string;
  original_name?: string;
  first_air_date?: string;
  popularity?: number;
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

// Card backdrop
const BackdropCard = ({ item }: { item: BackdropItem }) => {
  return (
    <div
      className="
        group
        relative shrink-0
        w-[230px] h-28
        sm:w-[260px] sm:h-32
        lg:w-[280px] lg:h-36
        overflow-hidden rounded-xl
        border border-white/8
        bg-black/40
        shadow-[0_14px_35px_rgba(0,0,0,0.85)]
        backdrop-blur-sm
        transition-transform duration-500
        hover:scale-[1.03]
      "
    >
      <img
        src={`${IMAGE_BASE_URL}${item.backdrop_path}`}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient phủ */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

      {/* Info */}
      <div className="absolute inset-x-2 bottom-2 flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-200">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-0.5 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            {item.media_type === "movie" ? "Movie" : "TV"}
          </span>
          <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-neutral-300">
            {item.releaseYear}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 text-[11px] font-semibold text-white md:text-[12px]">
            {item.title}
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-yellow-300">
            <span className="inline-block h-3.5 w-3.5 rounded-full bg-black/60 text-center text-[9px] leading-3.5">
              ★
            </span>
            <span>{item.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl border border-white/0 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_0_20px_rgba(248,113,113,0.6)]" />
    </div>
  );
};

const ExploreBackdropHeader = () => {
  const [items, setItems] = useState<BackdropItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBackdrops = async () => {
      try {
        setLoading(true);

        const moviePromise = axiosTMDB.get<TMDBListResponse<DiscoverMovieItem>>(
          "/discover/movie",
          {
            params: {
              sort_by: "primary_release_date.desc",
              primary_release_year: 2025,
              page: 1,
              "vote_count.gte": 50,
            },
          }
        );

        const tvPromise = axiosTMDB.get<TMDBListResponse<DiscoverTvItem>>(
          "/discover/tv",
          {
            params: {
              sort_by: "first_air_date.desc",
              first_air_date_year: 2025,
              page: 1,
              "vote_count.gte": 50,
            },
          }
        );

        const [movieRes, tvRes] = await Promise.all([moviePromise, tvPromise]);

        const movieItems: BackdropItem[] =
          movieRes.data.results
            .filter((m) => m.backdrop_path)
            .slice(0, 20)
            .map((m) => ({
              id: m.id,
              media_type: "movie" as const,
              title: m.title ?? m.original_title ?? "Untitled movie",
              backdrop_path: m.backdrop_path!,
              rating: m.vote_average ?? 0,
              popularity: m.popularity ?? 0,
              releaseYear: (m.release_date ?? "").slice(0, 4) || "2025",
            })) || [];

        const tvItems: BackdropItem[] =
          tvRes.data.results
            .filter((t) => t.backdrop_path)
            .slice(0, 20)
            .map((t) => ({
              id: t.id,
              media_type: "tv" as const,
              title: t.name ?? t.original_name ?? "Untitled show",
              backdrop_path: t.backdrop_path!,
              rating: t.vote_average ?? 0,
              popularity: t.popularity ?? 0,
              releaseYear: (t.first_air_date ?? "").slice(0, 4) || "2025",
            })) || [];

        const combined = [...movieItems, ...tvItems]
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 30);

        if (isMounted) setItems(combined);
      } catch (err) {
        console.error("ExploreBackdropHeader error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchBackdrops();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!items.length && !loading) return null;

  // 3 hàng, mỗi hàng tối đa 10
  const row1 = items.slice(0, 10);
  const row2 = items.slice(10, 20);
  const row3 = items.slice(20, 30);

  const row1Marquee = [...row1, ...row1];
  const row2Marquee = [...row2, ...row2];
  const row3Marquee = [...row3, ...row3];

  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-black via-neutral-950 to-neutral-900 py-4 md:py-6">
      {/* Glow nền */}
      <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -left-40 top-0 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-3">
        {/* HÀNG TRÊN: TIÊU ĐỀ BÊN TRÁI, NÚT BÊN PHẢI */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
          {/* Tiêu đề bên trái */}
          <div className="text-left z-10">
            <h2 className="flex items-center gap-3 text-lg md:text-4xl font-extrabold tracking-tight text-white">
              <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />
              Cinematic Backdrops • 2025 Spotlight
            </h2>

            <p className="mt-1 text-xs md:text-lg text-neutral-300">
              Nơi quy tụ những tấm backdrop ấn tượng nhất trong thế giới phim &
              series năm 2025.
            </p>
          </div>

          {/* Nút bên phải */}
          <div className="flex flex-wrap gap-2 text-xs justify-start md:justify-end z-10">
            <button className="rounded-full bg-red-600 px-3 py-1.5 md:px-4 md:py-1.5 font-semibold text-white transition hover:bg-red-700">
              Xem hot nhất
            </button>
            <button className="rounded-full border border-neutral-600 bg-neutral-900/80 px-3 py-1.5 md:px-4 md:py-1.5 font-medium text-neutral-100 transition hover:bg-neutral-800">
              Lọc theo thể loại
            </button>
          </div>
        </div>

        {/* KHUNG 3 HÀNG – CĂNG GIỮA */}
        <div className="relative h-[220px] sm:h-[260px] md:h-80 lg:h-[360px] overflow-visible">
          <div className="h-full perspective-[1800px] perspective-origin-center">
            <div
              className="
                relative flex h-full flex-col justify-center gap-4
                items-center
              "
              style={{
                transform: "rotateX(14deg) rotateY(-12deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Row 1 - chạy sang trái */}
              {row1.length > 0 && (
                <div className="flex gap-4 w-max min-w-full will-change-transform marquee-left">
                  {row1Marquee.map((item, index) => (
                    <BackdropCard
                      key={`row1-${item.id}-${index}`}
                      item={item}
                    />
                  ))}
                </div>
              )}

              {/* Row 2 - chạy sang phải */}
              {row2.length > 0 && (
                <div
                  className="flex gap-4 w-max min-w-full will-change-transform marquee-right opacity-80"
                  style={{ transform: "translateZ(-40px) scale(0.97)" }}
                >
                  {row2Marquee.map((item, index) => (
                    <BackdropCard
                      key={`row2-${item.id}-${index}`}
                      item={item}
                    />
                  ))}
                </div>
              )}

              {/* Row 3 - chạy sang trái */}
              {row3.length > 0 && (
                <div
                  className="flex gap-4 w-max min-w-full will-change-transform marquee-left opacity-70"
                  style={{ transform: "translateZ(-80px) scale(0.94)" }}
                >
                  {row3Marquee.map((item, index) => (
                    <BackdropCard
                      key={`row3-${item.id}-${index}`}
                      item={item}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS cho marquee, KHÔNG DÙNG TAILWIND ANIMATION NỮA */}
      <style>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .marquee-left {
          animation: marquee-left 26s linear infinite;
        }

        .marquee-right {
          animation: marquee-right 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default ExploreBackdropHeader;
