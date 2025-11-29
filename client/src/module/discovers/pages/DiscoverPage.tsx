// src/module/discover/pages/DiscoverPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import { fetchDiscoverMovies, fetchDiscoverTv } from "../store/discoverSlice";
import type {
  TMDBDiscoverMovieItem,
  TMDBDiscoverTvItem,
} from "../../../types/interface/discover";

type DiscoverMediaType = "movie" | "tv";

const sortOptions = [
  { value: "popularity.desc", label: "Popularity ↓" },
  { value: "popularity.asc", label: "Popularity ↑" },
  { value: "vote_average.desc", label: "Rating ↓" },
  { value: "vote_average.asc", label: "Rating ↑" },
  { value: "release_date.desc", label: "Release date ↓ (movie)" },
  { value: "release_date.asc", label: "Release date ↑ (movie)" },
  { value: "first_air_date.desc", label: "First air date ↓ (tv)" },
  { value: "first_air_date.asc", label: "First air date ↑ (tv)" },
];

const DiscoverPage = () => {
  const dispatch = useAppDispatch();
  const discoverState = useAppSelector((state) => state.tmdbDiscover);
  const imageURL = useAppSelector((state) => state.moviesData.imageURL);

  const [activeType, setActiveType] = useState<DiscoverMediaType>("movie");

  // bộ lọc chung
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const [minVote, setMinVote] = useState<number>(0);
  const [language, setLanguage] = useState<string>(""); // original_language code
  const [includeAdult, setIncludeAdult] = useState<boolean>(false); // chỉ áp dụng cho movie

  // page riêng cho movie & tv
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTvPage] = useState(1);

  // state active
  const activeList = useMemo(() => {
    return activeType === "movie" ? discoverState.movie : discoverState.tv;
  }, [activeType, discoverState]);

  // Fetch lần đầu + khi filter / page đổi
  useEffect(() => {
    const baseCommon = {
      sort_by: sortBy,
      "vote_average.gte": minVote > 0 ? minVote : undefined,
      with_original_language: language || undefined,
    };

    if (activeType === "movie") {
      dispatch(
        fetchDiscoverMovies({
          page: moviePage,
          ...baseCommon,
          include_adult: includeAdult || undefined,
        })
      );
    } else {
      dispatch(
        fetchDiscoverTv({
          page: tvPage,
          ...baseCommon,
        })
      );
    }
  }, [
    activeType,
    sortBy,
    minVote,
    language,
    includeAdult,
    moviePage,
    tvPage,
    dispatch,
  ]);

  const handlePageChange = (direction: "prev" | "next") => {
    if (activeList.loading) return;

    if (activeType === "movie") {
      setMoviePage((prev) => {
        if (direction === "prev") return Math.max(1, prev - 1);
        if (direction === "next")
          return Math.min(discoverState.movie.total_pages, prev + 1);
        return prev;
      });
    } else {
      setTvPage((prev) => {
        if (direction === "prev") return Math.max(1, prev - 1);
        if (direction === "next")
          return Math.min(discoverState.tv.total_pages, prev + 1);
        return prev;
      });
    }
  };

  // Helper build ảnh
  const buildImage = (poster: string | null, backdrop: string | null) => {
    if (poster) return imageURL + poster;
    if (backdrop) return imageURL + backdrop;
    return null;
  };

  // ===================== RENDER CARD =====================

  const renderMovieCard = (item: TMDBDiscoverMovieItem) => {
    const img = buildImage(item.poster_path, item.backdrop_path);
    const year = item.release_date ? item.release_date.slice(0, 4) : "—";

    return (
      <div
        key={item.id}
        className="
          group flex flex-col rounded-2xl border border-slate-200/80 bg-white/90
          shadow-sm backdrop-blur-sm overflow-hidden
          hover:-translate-y-1 hover:shadow-xl hover:border-rose-500/70
          transition
          dark:bg-slate-900/80 dark:border-slate-700/80
        "
      >
        {/* Image */}
        <div className="relative aspect-2/3 w-full bg-slate-200 dark:bg-slate-800">
          {img ? (
            <img
              src={img}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">
              No image
            </div>
          )}

          {/* Adult badge */}
          <div className="absolute left-2 top-2 flex gap-1">
            <span
              className={
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                (item.adult
                  ? "bg-rose-600 text-white"
                  : "bg-emerald-600 text-white")
              }
            >
              {item.adult ? "18+" : "PG"}
            </span>

            {/* Video badge */}
            {item.video && (
              <span className="inline-flex items-center rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                Video
              </span>
            )}
          </div>

          {/* Rating badge */}
          <div className="absolute bottom-2 left-2 rounded-full bg-black/80 px-2 py-1 text-xs text-white backdrop-blur">
            ⭐ {item.vote_average.toFixed(1)}{" "}
            <span className="text-[10px] text-slate-300">
              ({item.vote_count})
            </span>
          </div>

          {/* Popularity */}
          <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] text-slate-100 backdrop-blur">
            🔥 {Math.round(item.popularity)}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-rose-600 dark:text-slate-50 dark:group-hover:text-rose-400">
                {item.title}
              </h3>
              {item.original_title && item.original_title !== item.title && (
                <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Original: {item.original_title}
                </p>
              )}
            </div>
            <span className="mt-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {year}
            </span>
          </div>

          {/* Language + genre_ids */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Lang: {item.original_language.toUpperCase()}
            </span>
            {item.genre_ids.length > 0 && (
              <span className="truncate">
                Genres IDs:{" "}
                <span className="font-medium">{item.genre_ids.join(", ")}</span>
              </span>
            )}
          </div>

          {/* Overview */}
          <p className="mt-2 line-clamp-3 text-xs text-slate-600 dark:text-slate-300">
            {item.overview || (
              <span className="text-slate-400 dark:text-slate-500">
                No overview available.
              </span>
            )}
          </p>

          {/* Bottom actions */}
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
            <Link
              to={`/movie/${item.id}`}
              className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1 font-medium text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400"
            >
              View details
            </Link>
            <span className="truncate text-right text-slate-400 dark:text-slate-500">
              ID: {item.id}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderTvCard = (item: TMDBDiscoverTvItem) => {
    const img = buildImage(item.poster_path, item.backdrop_path);
    const year = item.first_air_date ? item.first_air_date.slice(0, 4) : "—";

    return (
      <div
        key={item.id}
        className="
          group flex flex-col rounded-2xl border border-slate-200/80 bg-white/90
          shadow-sm backdrop-blur-sm overflow-hidden
          hover:-translate-y-1 hover:shadow-xl hover:border-sky-500/70
          transition
          dark:bg-slate-900/80 dark:border-slate-700/80
        "
      >
        {/* Image */}
        <div className="relative aspect-2/3 w-full bg-slate-200 dark:bg-slate-800">
          {img ? (
            <img
              src={img}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">
              No image
            </div>
          )}

          {/* Top-left meta */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            <span className="inline-flex items-center rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-semibold text-white">
              TV
            </span>
            {item.origin_country?.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white">
                {item.origin_country.join(", ")}
              </span>
            )}
          </div>

          {/* Rating & popularity */}
          <div className="absolute bottom-2 left-2 rounded-full bg-black/80 px-2 py-1 text-xs text-white backdrop-blur">
            ⭐ {item.vote_average.toFixed(1)}{" "}
            <span className="text-[10px] text-slate-300">
              ({item.vote_count})
            </span>
          </div>
          <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] text-slate-100 backdrop-blur">
            🔥 {Math.round(item.popularity)}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-sky-600 dark:text-slate-50 dark:group-hover:text-sky-400">
                {item.name}
              </h3>
              {item.original_name && item.original_name !== item.name && (
                <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Original: {item.original_name}
                </p>
              )}
            </div>
            <span className="mt-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {year}
            </span>
          </div>

          {/* Language + genres */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Lang: {item.original_language.toUpperCase()}
            </span>
            {item.genre_ids.length > 0 && (
              <span className="truncate">
                Genres IDs:{" "}
                <span className="font-medium">{item.genre_ids.join(", ")}</span>
              </span>
            )}
          </div>

          {/* Overview */}
          <p className="mt-2 line-clamp-3 text-xs text-slate-600 dark:text-slate-300">
            {item.overview || (
              <span className="text-slate-400 dark:text-slate-500">
                No overview available.
              </span>
            )}
          </p>

          {/* Bottom actions */}
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
            <Link
              to={`/tv/${item.id}`}
              className="inline-flex items-center rounded-full bg-sky-600 px-3 py-1 font-medium text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400"
            >
              View details
            </Link>
            <span className="truncate text-right text-slate-400 dark:text-slate-500">
              ID: {item.id}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ===================== RENDER MAIN =====================

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Discover
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Khám phá movie & TV series bằng dữ liệu từ TMDB Discover API. Mọi
            field (rating, popularity, language, adult, genres, ...) đều được
            tận dụng để hiển thị.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs text-slate-600 dark:text-slate-400">
          <span className="inline-flex w-50 items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            /discover/movie & /discover/tv
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-2">
          {(["movie", "tv"] as DiscoverMediaType[]).map((type) => {
            const active = activeType === type;
            const label = type === "movie" ? "Movies" : "TV Series";
            const state =
              type === "movie" ? discoverState.movie : discoverState.tv;

            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={
                  "px-4 py-2 text-sm font-medium rounded-t-xl transition " +
                  (active
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800")
                }
              >
                <span>{label}</span>
                <span className="ml-2 text-xs opacity-75">
                  {state.total_results > 0 ? state.total_results : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Sort by */}
        <div className="flex flex-col gap-1 text-xs">
          <label className="text-slate-600 dark:text-slate-300">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => {
              const value = e.target.value;
              setSortBy(value);
              // reset page khi đổi sort
              setMoviePage(1);
              setTvPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min rating */}
        <div className="flex flex-col gap-1 text-xs">
          <label className="text-slate-600 dark:text-slate-300">
            Min rating (vote_average.gte)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={minVote}
              onChange={(e) => {
                setMinVote(Number(e.target.value));
                setMoviePage(1);
                setTvPage(1);
              }}
              className="flex-1"
            />
            <span className="w-8 text-right text-xs text-slate-700 dark:text-slate-200">
              {minVote.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Language */}
        <div className="flex flex-col gap-1 text-xs">
          <label className="text-slate-600 dark:text-slate-300">
            Original language (code)
          </label>
          <input
            type="text"
            placeholder="en, ja, ko..."
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value.trim());
              setMoviePage(1);
              setTvPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Include adult (movie only) */}
        <div className="flex flex-col justify-end text-xs">
          <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => {
                setIncludeAdult(e.target.checked);
                setMoviePage(1);
              }}
              className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-900"
            />
            <span>Include adult (movie only)</span>
          </label>
          <span className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
            TV không có flag include_adult, nên chỉ áp dụng cho Movies.
          </span>
        </div>
      </div>

      {/* Status line */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 dark:text-slate-400">
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {activeType === "movie" ? "Movies" : "TV Series"}
          </span>{" "}
          · Page{" "}
          <span className="font-semibold">
            {activeList.page}/{activeList.total_pages || 1}
          </span>{" "}
          · Total{" "}
          <span className="font-semibold">{activeList.total_results || 0}</span>
        </div>

        {activeList.loading && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="h-3 w-3 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            Đang tải dữ liệu discover…
          </div>
        )}
      </div>

      {/* Error */}
      {activeList.error && (
        <div className="mb-3 rounded-lg border border-rose-500/40 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-600/40">
          Error: {activeList.error}
        </div>
      )}

      {/* Grid */}
      <div className="min-h-60">
        {!activeList.loading &&
          !activeList.error &&
          activeList.items.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              Không có kết quả nào với bộ lọc hiện tại.
            </div>
          )}

        {activeList.items.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {activeType === "movie"
              ? activeList.items.map((item) =>
                  renderMovieCard(item as TMDBDiscoverMovieItem)
                )
              : activeList.items.map((item) =>
                  renderTvCard(item as TMDBDiscoverTvItem)
                )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <div>
          Page{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {activeList.page}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {activeList.total_pages || 1}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={activeList.page <= 1 || activeList.loading}
            onClick={() => handlePageChange("prev")}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={
              activeList.page >= activeList.total_pages || activeList.loading
            }
            onClick={() => handlePageChange("next")}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
