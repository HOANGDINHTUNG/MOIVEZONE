import { useEffect, useMemo, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../hooks/UseCustomeRedux";

import type {
  TMDBTimeWindow,
  TMDBTrendingAllItem,
  TMDBTrendingMovieItem,
  TMDBTrendingTvItem,
  TMDBTrendingPersonItem,
  TrendingCategory,
} from "../database/interface/trending";
import { MovieTvCard, PersonCard } from "../components/TrendingCards";
import { fetchTrending, setCategory, setPage, setTimeWindow } from "../store/trendingSlice";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

const categoryLabel: Record<TrendingCategory, string> = {
  all: "All",
  movie: "Movies",
  tv: "TV Shows",
  person: "People",
};

const categoryDescription: Record<TrendingCategory, string> = {
  all: "Tổng hợp mọi thứ đang hot: phim, TV show và diễn viên.",
  movie: "Những bộ phim đang được xem và bàn luận nhiều nhất.",
  tv: "TV show đang hot theo tuần & theo ngày.",
  person: "Diễn viên, đạo diễn & nghệ sĩ đang được chú ý.",
};

const timeWindowLabel: Record<TMDBTimeWindow, string> = {
  day: "Today",
  week: "This Week",
};

const TrendingPage = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const language = useAppSelector((s) => s.language?.current) ?? "en-US";

  // lấy state từ trending slice
  const { category, timeWindow, page, items, totalPages, loading, error } =
    useAppSelector((s) => s.trending);

  // fetch trending mỗi khi category/timeWindow/page/language đổi
  useEffect(() => {
    dispatch(
      fetchTrending({
        category,
        timeWindow,
        page,
        language,
      })
    );
  }, [category, timeWindow, page, language, dispatch]);

  // hero item = item đầu tiên
  const heroItem = useMemo(() => items[0], [items]);
  const restItems = useMemo(() => items.slice(1), [items]);

  const handleGoToDetails = (item: TMDBTrendingAllItem) => {
    if (item.media_type === "movie") {
      navigate(`/movie/${(item as TMDBTrendingMovieItem).id}`);
    } else if (item.media_type === "tv") {
      navigate(`/tv/${(item as TMDBTrendingTvItem).id}`);
    } else {
      navigate(`/person/${(item as TMDBTrendingPersonItem).id}`);
    }
  };

  const heroBackdrop =
    heroItem &&
    ("backdrop_path" in heroItem
      ? heroItem.backdrop_path
      : "profile_path" in heroItem
      ? heroItem.profile_path
      : null);

  const heroTitle =
    heroItem &&
    (heroItem.media_type === "movie"
      ? (heroItem as TMDBTrendingMovieItem).title
      : heroItem.media_type === "tv"
      ? (heroItem as TMDBTrendingTvItem).name
      : heroItem.name);

  const heroOverview =
    heroItem &&
    (heroItem.media_type === "person"
      ? heroItem.known_for
          ?.map((k) => ("title" in k ? k.title : k.name))
          .join(", ") || "Nổi tiếng với nhiều tác phẩm."
      : heroItem.overview || "Chưa có nội dung mô tả.");

  const heroTypeText =
    heroItem &&
    (heroItem.media_type === "movie"
      ? "Movie"
      : heroItem.media_type === "tv"
      ? "TV Show"
      : "Person");

  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-950 via-neutral-950 to-neutral-900 text-neutral-50">
      {/* Container */}
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 md:px-6 lg:px-10">
        {/* Header + Filter */}
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900/80 px-3 py-1 ring-1 ring-neutral-700/60">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                Live Trending
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-50 md:text-4xl">
              Pulse Trending
              <span className="ml-2 bg-linear-to-r from-[#ecad29] via-orange-400 to-red-500 bg-clip-text text-2xl font-bold text-transparent md:text-[2.5rem]">
                {timeWindowLabel[timeWindow]}
              </span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-neutral-300 md:text-[15px]">
              Khám phá mọi thứ đang được xem, tìm kiếm và bàn luận nhiều nhất
              trên toàn thế giới – cập nhật theo thời gian thực từ TMDB.
            </p>
          </div>

          {/* Time window + category */}
          <div className="flex flex-col gap-3 md:items-end">
            {/* time window */}
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900/80 p-1 ring-1 ring-neutral-700/70 backdrop-blur">
              {(["day", "week"] as TMDBTimeWindow[]).map((tw) => (
                <button
                  key={tw}
                  type="button"
                  onClick={() => dispatch(setTimeWindow(tw))}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                    timeWindow === tw
                      ? "bg-linear-to-r from-[#ecad29] to-orange-500 text-neutral-900 shadow"
                      : "text-neutral-300 hover:bg-neutral-800/80"
                  }`}
                >
                  {timeWindowLabel[tw]}
                </button>
              ))}
            </div>

            {/* category tabs */}
            <div className="inline-flex gap-1 rounded-full bg-neutral-900/80 p-1 ring-1 ring-neutral-700/70 backdrop-blur">
              {(["all", "movie", "tv", "person"] as TrendingCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => dispatch(setCategory(cat))}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                      category === cat
                        ? "bg-neutral-50 text-neutral-900 shadow"
                        : "text-neutral-300 hover:bg-neutral-800/80"
                    }`}
                  >
                    {categoryLabel[cat]}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* description under tabs */}
        <p className="text-[13px] text-neutral-300">
          {categoryDescription[category]}
        </p>

        {/* Hero */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* hero card */}
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800/80 bg-neutral-900/70">
            <div className="relative h-[260px] w-full overflow-hidden rounded-t-3xl md:h-80">
              {heroItem && heroBackdrop ? (
                <img
                  src={`${IMAGE_BASE}/w1280${heroBackdrop}`}
                  alt={heroTitle || ""}
                  className="h-full w-full object-cover object-center brightness-90 transition-transform duration-1200 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-850 text-sm text-neutral-400">
                  No hero content
                </div>
              )}

              {/* overlay gradient */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/80 via-black/40 to-transparent" />

              {/* hero info */}
              {heroItem && (
                <div className="absolute inset-x-5 bottom-5 flex flex-col gap-3 md:max-w-[70%]">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex h-[18px] items-center rounded-full bg-neutral-950/80 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-200 backdrop-blur">
                      {heroTypeText}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-950/80 px-2 text-[10px] text-neutral-200 backdrop-blur">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Hot Rank #1
                    </span>
                  </div>

                  <h2 className="text-xl font-bold leading-tight tracking-tight text-neutral-50 md:text-3xl">
                    {heroTitle}
                  </h2>

                  <p className="line-clamp-2 text-[12px] text-neutral-200 md:line-clamp-3 md:text-[13px]">
                    {heroOverview}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-neutral-200">
                    {"vote_average" in heroItem && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-neutral-950/80 px-2 py-1 text-[11px] backdrop-blur">
                        <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ecad29]/20 text-[10px] font-semibold text-[#ecad29]">
                          {heroItem.vote_average.toFixed(1)}
                        </span>
                        <span className="font-medium">User Score</span>
                        <span className="text-[10px] text-neutral-400">
                          {heroItem.vote_count} votes
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleGoToDetails(heroItem)}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-50 px-3 py-1.5 text-[11px] font-semibold text-neutral-950 shadow transition hover:bg-[#ecad29]"
                    >
                      View detail
                      <span className="text-[13px]">↗</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* bottom strip (small stats) */}
            <div className="flex items-center justify-between border-t border-neutral-800/80 bg-linear-to-r from-neutral-950/80 via-neutral-900/80 to-neutral-950/80 px-4 py-3 text-[11px] text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span>Live worldwide trends powered by TMDB</span>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <span className="rounded-full bg-neutral-900 px-2 py-1 text-[10px]">
                  {timeWindowLabel[timeWindow]}
                </span>
                <span className="rounded-full bg-neutral-900 px-2 py-1 text-[10px]">
                  Page {page}/{totalPages || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Side list: top 6 items nhỏ */}
          <div className="flex flex-col gap-3 rounded-3xl border border-neutral-800/80 bg-neutral-900/60 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-50">
                Top Trend Snapshot
              </h3>
              <span className="text-[11px] text-neutral-400">
                {items.length} items
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {items.slice(0, 6).map((item, index) => {
                const smallTitle =
                  item.media_type === "movie"
                    ? (item as TMDBTrendingMovieItem).title
                    : item.media_type === "tv"
                    ? (item as TMDBTrendingTvItem).name
                    : item.name;

                const smallType =
                  item.media_type === "movie"
                    ? "Movie"
                    : item.media_type === "tv"
                    ? "TV"
                    : "Person";

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleGoToDetails(item)}
                    className="group flex items-center gap-3 rounded-2xl bg-neutral-950/50 px-2 py-2 text-left ring-1 ring-transparent transition hover:bg-neutral-900/80 hover:ring-neutral-700"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-neutral-200 group-hover:bg-[#ecad29] group-hover:text-neutral-950">
                      #{index + 1}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="line-clamp-1 text-[12px] font-medium text-neutral-50 group-hover:text-[#ecad29]">
                        {smallTitle}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {smallType}
                        {"vote_average" in item &&
                          ` • Score ${item.vote_average.toFixed(1)}`}
                      </span>
                    </div>
                    <span className="text-[13px] text-neutral-500 group-hover:text-neutral-300">
                      ↗
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* List grid */}
        <section className="mt-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-100 md:text-base">
              All Trending {categoryLabel[category]}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span>
                Page {page}/{totalPages || 1}
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/50 bg-red-950/40 px-4 py-3 text-[13px] text-red-100">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse overflow-hidden rounded-2xl bg-neutral-900/80"
                >
                  <div className="aspect-2/3 w-full bg-neutral-800" />
                  <div className="space-y-2 px-3 py-3">
                    <div className="h-3 w-3/4 rounded bg-neutral-800" />
                    <div className="h-3 w-1/2 rounded bg-neutral-800" />
                    <div className="h-3 w-full rounded bg-neutral-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {restItems.map((item) =>
                item.media_type === "person" ? (
                  <PersonCard
                    key={`person-${item.id}`}
                    item={item as TMDBTrendingPersonItem}
                    onClick={() =>
                      handleGoToDetails(item as TMDBTrendingPersonItem)
                    }
                  />
                ) : (
                  <MovieTvCard
                    key={`${item.media_type}-${item.id}`}
                    item={item as TMDBTrendingMovieItem | TMDBTrendingTvItem}
                    onClick={() => handleGoToDetails(item)}
                  />
                )
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => dispatch(setPage(page - 1))}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-1.5 text-[12px] text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:text-neutral-500"
            >
              ← Prev
            </button>
            <span className="text-[12px] text-neutral-300">
              Page <span className="font-semibold text-neutral-50">{page}</span>{" "}
              /{totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => dispatch(setPage(page + 1))}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-1.5 text-[12px] text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:text-neutral-500"
            >
              Next →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TrendingPage;
