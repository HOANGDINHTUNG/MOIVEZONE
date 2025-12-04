import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import type { TMDBChangeMediaType } from "../database/interface/changes";
import { fetchTMDBChanges } from "../store/changesSlice";

const MEDIA_LABEL: Record<TMDBChangeMediaType, string> = {
  movie: "Movie",
  tv: "TV",
  person: "Person",
};

const ChangesPage = () => {
  const dispatch = useAppDispatch();
  const changes = useAppSelector((state) => state.tmdbChanges);

  const [activeType, setActiveType] = useState<TMDBChangeMediaType>("movie");

  const activeState = useMemo(() => changes[activeType], [changes, activeType]);

  // Lần đầu vào mỗi tab thì load data nếu chưa có
  useEffect(() => {
    const stateForType = changes[activeType];
    if (!stateForType.items.length && !stateForType.loading) {
      dispatch(fetchTMDBChanges({ mediaType: activeType, page: 1 }));
    }
  }, [activeType, changes, dispatch]);

  const handlePageChange = (direction: "prev" | "next") => {
    if (activeState.loading) return;

    let nextPage = activeState.page;
    if (direction === "prev" && activeState.page > 1) {
      nextPage = activeState.page - 1;
    }
    if (direction === "next" && activeState.page < activeState.total_pages) {
      nextPage = activeState.page + 1;
    }

    if (nextPage !== activeState.page) {
      dispatch(
        fetchTMDBChanges({
          mediaType: activeType,
          page: nextPage,
        })
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            TMDB Changes
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Theo dõi các movie / TV show / person vừa được TMDB cập nhật gần
            đây. Phù hợp cho mục đích admin/dev, debug & đồng bộ dữ liệu.
          </p>
        </div>

        <div className="flex flex-col items-end text-xs text-slate-600 dark:text-slate-400 gap-1">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Admin / Dev Tool
          </span>
          <span className="text-[11px]">
            Dữ liệu raw từ TMDB, chỉ bao gồm ID + flag adult.
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex flex-wrap gap-2">
          {(["movie", "tv", "person"] as TMDBChangeMediaType[]).map((type) => {
            const active = activeType === type;
            const state = changes[type];
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={
                  "px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition border inline-flex items-center gap-1 " +
                  (active
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                    : "bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700")
                }
              >
                <span>{MEDIA_LABEL[type]}</span>
                <span className="text-[11px] opacity-80">
                  {state.total_results > 0 ? state.total_results : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status line */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {MEDIA_LABEL[activeType]} changes
          </span>{" "}
          · Page{" "}
          <span className="font-medium">
            {activeState.page}/{activeState.total_pages || 1}
          </span>{" "}
          · Total{" "}
          <span className="font-medium">{activeState.total_results || 0}</span>
        </div>

        {activeState.loading && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="h-3 w-3 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            Đang tải dữ liệu…
          </div>
        )}
      </div>

      {/* Error */}
      {activeState.error && (
        <div className="mb-3 rounded-lg border border-rose-500/40 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-600/40">
          Error: {activeState.error}
        </div>
      )}

      {/* List */}
      <div className="min-h-[200px]">
        {activeState.items.length === 0 &&
          !activeState.loading &&
          !activeState.error && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              Chưa có dữ liệu changes cho {MEDIA_LABEL[activeType]} ở trang này.
            </div>
          )}

        {activeState.items.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeState.items.map((item) => {
              const tmdbUrl =
                activeType === "movie"
                  ? `https://www.themoviedb.org/movie/${item.id}`
                  : activeType === "tv"
                  ? `https://www.themoviedb.org/tv/${item.id}`
                  : `https://www.themoviedb.org/person/${item.id}`;

              return (
                <div
                  key={item.id}
                  className="flex flex-col rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:border-rose-500/60 hover:shadow-md dark:bg-slate-900/70 dark:border-slate-700/70"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {MEDIA_LABEL[activeType]}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
                        ID #{item.id}
                      </div>
                    </div>
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium " +
                        (item.adult
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300")
                      }
                    >
                      {item.adult ? "Adult" : "Non-adult"}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    Endpoint{" "}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                      /{activeType}/changes
                    </code>{" "}
                    chỉ trả về ID + flag adult. Nếu cần hiển thị poster, title,
                    name… bạn có thể gọi thêm API chi tiết theo ID.
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <a
                      href={tmdbUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Mở trên TMDB
                    </a>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      Dùng ID này để sync/update chi tiết trong hệ thống của
                      bạn.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <div>
          Page{" "}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {activeState.page}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {activeState.total_pages || 1}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={activeState.page <= 1 || activeState.loading}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Prev
          </button>
          <button
            onClick={() => handlePageChange("next")}
            disabled={
              activeState.page >= activeState.total_pages || activeState.loading
            }
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangesPage;
