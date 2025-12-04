import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import { fetchMoviesCategories } from "../store/moviesCategorySlice";

import { useNavigate, useParams } from "react-router-dom";
import type { TMDBMovieListItem } from "../database/interface/movieLists";
import MovieCard from "../components/MovieCard";

type MovieTabKey = "now_playing" | "popular" | "top_rated" | "upcoming";

const TABS: { key: MovieTabKey; label: string; description: string }[] = [
  {
    key: "now_playing",
    label: "Now Playing",
    description: "Phim đang chiếu ngoài rạp – nóng hổi từng suất.",
  },
  {
    key: "popular",
    label: "Popular",
    description: "Được xem nhiều nhất, phủ sóng khắp mọi nơi.",
  },
  {
    key: "top_rated",
    label: "Top Rated",
    description: "Điểm số cao ngất – đáng để binge nhất.",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    description: "Sắp công chiếu, thêm ngay vào watchlist.",
  },
];

export default function MoviesCategoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // lấy param từ route
  const { type } = useParams<{ type: MovieTabKey }>();

  const activeTab: MovieTabKey =
    type && TABS.some((t) => t.key === type) ? type : "now_playing";

  const { nowPlaying, popular, topRated, upcoming, loading, error } =
    useAppSelector((state) => state.moviesCategories);

  // fetch 1 lần duy nhất
  useEffect(() => {
    dispatch(fetchMoviesCategories());
  }, [dispatch]);

  const currentMovies: TMDBMovieListItem[] = useMemo(() => {
    switch (activeTab) {
      case "now_playing":
        return nowPlaying;
      case "popular":
        return popular;
      case "top_rated":
        return topRated;
      case "upcoming":
        return upcoming;
      default:
        return [];
    }
  }, [activeTab, nowPlaying, popular, topRated, upcoming]);

  const currentTabMeta = TABS.find((t) => t.key === activeTab)!;

  const goToTab = (key: MovieTabKey) => {
    navigate(`/category_movie/${key}`);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-950 via-black to-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:pt-10">
        {/* header */}
        <header className="mb-6 space-y-4 md:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-300 ring-1 ring-yellow-400/40">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
            Movie Explorer
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
            Discover Movies by Category
          </h1>
          <p className="max-w-2xl text-sm text-neutral-400 md:text-base">
            Chọn loại phim bạn muốn xem – đang chiếu, phổ biến, điểm cao hoặc
            sắp ra mắt.
          </p>

          {/* tabs */}
          <div className="mt-4 inline-flex gap-2 rounded-full bg-neutral-900/80 p-1 ring-1 ring-neutral-800">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => goToTab(tab.key)}
                  className={[
                    "relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all md:px-4 md:text-sm",
                    isActive
                      ? "bg-yellow-400 text-black shadow-lg"
                      : "text-neutral-300 hover:bg-neutral-800/80",
                  ].join(" ")}
                >
                  {isActive && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-yellow-400/40 blur-md" />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* trạng thái */}
        {loading && (
          <div className="flex justify-center pb-10">
            <div className="flex items-center gap-3 rounded-full bg-neutral-900/80 px-4 py-2 text-sm text-neutral-300 ring-1 ring-neutral-800">
              <span className="h-2 w-2 animate-ping rounded-full bg-yellow-400" />
              Đang tải phim...
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {/* grid */}
        {!loading && !error && (
          <>
            <section className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-50 md:text-xl">
                  <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
                  {currentTabMeta.label}
                </h2>
                <p className="mt-1 text-xs text-neutral-400 md:text-sm">
                  {currentTabMeta.description}
                </p>
              </div>
              <div className="text-xs text-neutral-400 md:text-sm">
                {currentMovies.length} movies found
              </div>
            </section>

            <section>
              {currentMovies.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-center text-sm text-neutral-400">
                  Không có phim nào.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {currentMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
