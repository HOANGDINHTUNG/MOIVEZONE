import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import type { TvSummary } from "../database/interface/tv";
import { tmdbApi } from "../../../api/movie/TMDB.api";
import Card from "../../../components/common/Card";

const ITEMS_PER_LOAD = 40;

const AllTvShowsPage = () => {
  const language = useAppSelector((state) => state.language.current);

  const [shows, setShows] = useState<TvSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = page <= totalPages;

  const parseDate = (dateStr?: string | null): number => {
    if (!dateStr) return 0;
    const t = Date.parse(dateStr);
    return Number.isNaN(t) ? 0 : t;
  };

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      let collected: TvSummary[] = [];
      let nextPage = page;
      let total = totalPages;

      // Gom đủ 40 item mỗi lần load (hoặc hết page)
      while (collected.length < ITEMS_PER_LOAD && nextPage <= total) {
        const res = await tmdbApi.discoverTvShows(nextPage, language);

        if (nextPage === 1) {
          total = res.total_pages;
        }
        setTotalPages(res.total_pages);

        collected = collected.concat(res.results);
        nextPage += 1;

        if (!res.results.length) break;
      }

      // Gộp với state cũ, loại trùng id + sort lại cho mới nhất lên đầu
      setShows((prev) => {
        const map = new Map<number, TvSummary>();

        // ưu tiên data mới hơn từ API bằng cách set prev trước rồi override bằng collected
        for (const s of prev) {
          map.set(s.id, s);
        }
        for (const s of collected) {
          map.set(s.id, s);
        }

        const merged = Array.from(map.values());

        merged.sort((a, b) => {
          const da = parseDate(a.first_air_date);
          const db = parseDate(b.first_air_date);

          if (db !== da) return db - da; // mới nhất trước
          return (b.popularity ?? 0) - (a.popularity ?? 0); // tie-break
        });

        return merged;
      });

      setPage(nextPage);
    } catch (error) {
      console.error("Load more TV shows error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, totalPages, language, loading, hasMore]);

  // Khi đổi language thì reset list + page
  useEffect(() => {
    setShows([]);
    setPage(1);
    setTotalPages(1);
  }, [language]);

  // Load lần đầu + sau khi reset
  useEffect(() => {
    // nếu chưa có dữ liệu thì tự load
    if (shows.length === 0 && !loading) {
      loadMore();
    }
  }, [loadMore, shows.length, loading]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Tất cả TV show
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Danh sách TV show mới nhất (mới lên sóng ở trên, cũ dần về sau).
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {shows.map((show) => (
          <Card key={show.id} data={show} media_type="tv" />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
          >
            {loading ? "Đang tải..." : "Tải thêm 40 TV show"}
          </button>
        ) : (
          <p className="text-sm text-neutral-500">
            Đã hết TV show để tải rồi 😄
          </p>
        )}
      </div>
    </section>
  );
};

export default AllTvShowsPage;
