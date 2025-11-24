// src/pages/SearchPage.tsx
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosTMDB from "../../../app/axiosTMDB";
import Card from "../../../components/common/Card";

import type { TMDBListResponse } from "../../movies/database/interface/tmdb";
import type { MovieSummary } from "../../movies/database/interface/movie";
import type { TvSummary } from "../../movies/database/interface/tv";

// Kết quả search multi thực tế có 3 loại: movie, tv, person
type SearchMovieItem = MovieSummary & { media_type: "movie" };
type SearchTvItem = TvSummary & { media_type: "tv" };

interface SearchPersonItem {
  id: number;
  name: string;
  media_type: "person";
  profile_path: string | null;
}

type SearchMultiItem = SearchMovieItem | SearchTvItem | SearchPersonItem;

// Dữ liệu đưa vào Card: chỉ movie + tv
type CardMovie = SearchMovieItem | SearchTvItem;

const SearchPage = () => {
  const location = useLocation();

  // Lấy query từ URL (?s=...)
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("s") ?? "";

  const [data, setData] = useState<CardMovie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Hàm clear kết quả tìm kiếm
  const clearResults = useCallback(() => {
    setPage(1);
    setData([]);
    setTotalPages(0);
  }, []);

  // Hàm fetch có useCallback để không bị lỗi missing dependency
  const fetchData = useCallback(
    async (pageToLoad: number, reset = false) => {
      const trimmed = query.trim();
      if (!trimmed) {
        clearResults();
        return;
      }

      try {
        setLoading(true);

        const res = await axiosTMDB.get<TMDBListResponse<SearchMultiItem>>(
          "/search/multi",
          {
            params: {
              query: trimmed,
              page: pageToLoad,
              include_adult: false,
            },
          }
        );

        const onlyMoviesAndTv = res.data.results.filter(
          (item): item is CardMovie =>
            item.media_type === "movie" || item.media_type === "tv"
        );

        setTotalPages(res.data.total_pages);
        setPage(pageToLoad);
        setData((prev) =>
          reset ? onlyMoviesAndTv : [...prev, ...onlyMoviesAndTv]
        );
      } catch (error) {
        console.error("SearchPage error:", error);
      } finally {
        setLoading(false);
      }
    },
    [query, clearResults]
  );

  // Khi query trên URL thay đổi
  useEffect(() => {
    fetchData(1, true);
  }, [fetchData]);

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      fetchData(page + 1);
    }
  };

  return (
    <div className="container mx-auto px-3 py-4">
      <h2 className="text-2xl font-semibold mb-2">
        Search results for:{" "}
        <span className="text-primary">{query || "..."}</span>
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        {data.length} results
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.map((item) => (
          <Card
            key={item.id + "search"}
            data={item}
            media_type={item.media_type}
          />
        ))}
      </div>

      {page < totalPages && (
        <div className="flex justify-center my-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-full text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
