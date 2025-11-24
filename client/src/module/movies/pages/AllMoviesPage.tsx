// src/module/movies/pages/AllMoviesPage.tsx

import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import type { MovieSummary } from "../database/interface/movie";
import { tmdbApi } from "../../../api/TMDB.api";
import Card from "../../../components/common/Card";

const ITEMS_PER_LOAD = 40;

const AllMoviesPage = () => {
  const language = useAppSelector((state) => state.language.current);

  const [movies, setMovies] = useState<MovieSummary[]>([]);
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
      let collected: MovieSummary[] = [];
      let nextPage = page;
      let total = totalPages;

      // Gom đủ 40 phim mỗi lần load (hoặc hết page)
      while (collected.length < ITEMS_PER_LOAD && nextPage <= total) {
        const res = await tmdbApi.discoverMovies(nextPage, language);

        if (nextPage === 1) {
          total = res.total_pages;
        }
        setTotalPages(res.total_pages);

        collected = collected.concat(res.results);
        nextPage += 1;

        if (!res.results.length) break;
      }

      // Gộp với state cũ, loại trùng id + sort cho phim mới nhất lên đầu
      setMovies((prev) => {
        const map = new Map<number, MovieSummary>();

        // đặt prev trước, rồi override bằng collected để data mới hơn được ưu tiên
        for (const m of prev) {
          map.set(m.id, m);
        }
        for (const m of collected) {
          map.set(m.id, m);
        }

        const merged = Array.from(map.values());

        merged.sort((a, b) => {
          const da = parseDate(a.release_date);
          const db = parseDate(b.release_date);

          if (db !== da) return db - da; // mới nhất trước
          return (b.popularity ?? 0) - (a.popularity ?? 0); // cùng ngày thì phim hot hơn trước
        });

        return merged;
      });

      setPage(nextPage);
    } catch (error) {
      console.error("Load more movies error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, totalPages, language, loading, hasMore]);

  // reset khi đổi language
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(1);
  }, [language]);

  // lần đầu (hoặc sau reset) thì tự load
  useEffect(() => {
    if (!movies.length && !loading) {
      loadMore();
    }
  }, [loadMore, movies.length, loading]);

  return (
    <section className="max-w-6xl mx-auto px-3 py-6">
      <h1 className="text-2xl font-bold mb-1">
        Phim mới nhất
      </h1>
      <p className="text-sm text-neutral-500 mb-4">
        Danh sách phim sắp ra mắt / mới ra mắt sẽ ở trên, cũ dần về sau.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Card key={movie.id} data={movie} media_type="movie" />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        {hasMore ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Đang tải..." : "Tải thêm 40 phim"}
          </button>
        ) : (
          <p className="text-sm text-neutral-500">
            Đã hết phim để tải rồi 😄
          </p>
        )}
      </div>
    </section>
  );
};

export default AllMoviesPage;
