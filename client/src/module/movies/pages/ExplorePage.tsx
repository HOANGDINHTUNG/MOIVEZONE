// src/pages/ExplorePage.tsx
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axiosTMDB from "../../../app/axiosTMDB";
import Card from "../../../components/common/Card";

import type { TMDBListResponse } from "../database/interface/tmdb";
import type { MovieSummary } from "../database/interface/movie";
import type { TvSummary } from "../database/interface/tv";

// Dữ liệu cho Card: có thể là movie hoặc tv summary
type CardMovie = MovieSummary | TvSummary;

const ExplorePage = () => {
  // param :explore -> "movie" | "tv"
  const { explore } = useParams<"explore">();

  // Chuẩn hóa về 2 loại duy nhất
  const mediaType: "movie" | "tv" = explore === "tv" ? "tv" : "movie";

  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState<CardMovie[]>([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (page: number, reset = false) => {
      try {
        setLoading(true);

        if (mediaType === "movie") {
          const res = await axiosTMDB.get<TMDBListResponse<MovieSummary>>(
            `/discover/movie`,
            {
              params: {
                page,
                sort_by: "popularity.desc",
              },
            }
          );

          setTotalPageNo(res.data.total_pages);
          setPageNo(page);
          setData((prev) =>
            reset ? res.data.results : [...prev, ...res.data.results]
          );
        } else {
          const res = await axiosTMDB.get<TMDBListResponse<TvSummary>>(
            `/discover/tv`,
            {
              params: {
                page,
                sort_by: "popularity.desc",
              },
            }
          );

          setTotalPageNo(res.data.total_pages);
          setPageNo(page);
          setData((prev) =>
            reset ? res.data.results : [...prev, ...res.data.results]
          );
        }
      } catch (error) {
        console.error("ExplorePage error:", error);
      } finally {
        setLoading(false);
      }
    },
    [mediaType]
  );

  // Khi mediaType đổi (movie <-> tv) -> load lại từ trang 1
  useEffect(() => {
    fetchData(1, true);
  }, [fetchData]);

  const handleLoadMore = () => {
    if (pageNo < totalPageNo && !loading) {
      fetchData(pageNo + 1);
    }
  };

  const headingLabel = mediaType === "movie" ? "Movies" : "TV Shows";

  return (
    <div className="container mx-auto px-3 py-4">
      <h2 className="text-2xl font-semibold capitalize mb-4 text-neutral-900 dark:text-white">
        Explore {headingLabel}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.map((item) => (
          <Card
            key={item.id + "exploreSection"}
            data={item}
            media_type={mediaType}
          />
        ))}
      </div>

      {pageNo < totalPageNo && (
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

export default ExplorePage;
