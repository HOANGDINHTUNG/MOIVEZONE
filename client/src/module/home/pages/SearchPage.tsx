import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosTMDB from "../../../app/axiosTMDB";
import Card from "../../../components/common/Card";
import type { TMDBMovieSummary } from "../../movies/database/interface/movie";
import type { TMDBTvSummary } from "../../movies/database/interface/tvList";
import type { TMDBPaginatedResponse } from "../../movies/database/interface/movieLists";

type SearchMovieItem = TMDBMovieSummary & { media_type: "movie" };
type SearchTvItem = TMDBTvSummary & { media_type: "tv" };

interface SearchPersonItem {
  id: number;
  name: string;
  media_type: "person";
  profile_path: string | null;
}

type SearchMultiItem = SearchMovieItem | SearchTvItem | SearchPersonItem;
type CardMovie = SearchMovieItem | SearchTvItem;

const ITEMS_PER_PAGE = 20; // 20 phim / trang

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("s") ?? "";

  // allResults = TẤT CẢ movie+tv cho query hiện tại
  const [allResults, setAllResults] = useState<CardMovie[]>([]);
  // page = trang UI (client side), không phải page TMDB
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const hasQuery = useMemo(() => query.trim().length > 0, [query]);

  const clearResults = useCallback(() => {
    setPage(1);
    setAllResults([]);
    setTotalPages(0);
  }, []);

  // ✅ Hàm fetch: lấy N page từ TMDB, lọc chỉ movie+tv, rồi mới phân trang ở client
  const fetchAllResults = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      clearResults();
      return;
    }

    try {
      setLoading(true);

      // ---- 1. Gọi page 1 trước ----
      const firstRes = await axiosTMDB.get<
        TMDBPaginatedResponse<SearchMultiItem>
      >("/search/multi", {
        params: {
          query: trimmed,
          page: 1,
          include_adult: false,
        },
      });

      const totalPagesFromApi = firstRes.data.total_pages;

      // Giới hạn số page gọi từ TMDB, tránh gọi quá nhiều
      const maxApiPages = Math.min(totalPagesFromApi, 5); // lấy tối đa 5 page TMDB

      const responses: TMDBPaginatedResponse<SearchMultiItem>[] = [
        firstRes.data,
      ];

      // ---- 2. Gọi thêm các page 2..maxApiPages ----
      if (maxApiPages > 1) {
        const promises = [];
        for (let p = 2; p <= maxApiPages; p++) {
          promises.push(
            axiosTMDB.get<TMDBPaginatedResponse<SearchMultiItem>>(
              "/search/multi",
              {
                params: {
                  query: trimmed,
                  page: p,
                  include_adult: false,
                },
              }
            )
          );
        }

        const moreRes = await Promise.all(promises);
        moreRes.forEach((r) => responses.push(r.data));
      }

      // ---- 3. Gộp tất cả results, chỉ giữ movie + tv ----
      const mergedMoviesAndTv: CardMovie[] = [];
      for (const data of responses) {
        for (const item of data.results) {
          if (item.media_type === "movie" || item.media_type === "tv") {
            mergedMoviesAndTv.push(item as CardMovie);
          }
        }
      }

      // ---- 4. Cập nhật state cho client pagination ----
      setAllResults(mergedMoviesAndTv);
      setPage(1);
      setTotalPages(
        mergedMoviesAndTv.length === 0
          ? 0
          : Math.ceil(mergedMoviesAndTv.length / ITEMS_PER_PAGE)
      );
    } catch (error) {
      console.error("SearchPage error:", error);
      clearResults();
    } finally {
      setLoading(false);
    }
  }, [query, clearResults]);

  useEffect(() => {
    fetchAllResults();
  }, [fetchAllResults]);

  const handleChangeSearch = (value: string) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("s", value);
    } else {
      params.delete("s");
    }
    navigate(`/search?${params.toString()}`);
  };

  // ✅ Bây giờ đổi handlePageChange: chỉ đổi page UI, không fetch TMDB nữa
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || loading) return;
    setPage(newPage);
  };

  const renderPageNumbers = () => {
    if (!totalPages || totalPages === 1) return null;

    const buttons: JSX.Element[] = [];
    const maxButtons = 5;

    let start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let p = start; p <= end; p++) {
      buttons.push(
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition ${
            p === page
              ? "bg-red-600 text-white shadow-[0_0_15px_rgba(248,113,113,0.6)]"
              : "bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700"
          }`}
        >
          {p}
        </button>
      );
    }

    return buttons;
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  // ✅ TÍNH DATA CHO TRANG HIỆN TẠI (20 item)
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentPageItems = allResults.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* HERO kiểu Netflix */}
      <section className="relative overflow-hidden border-b border-neutral-900">
        {/* ẢNH NỀN */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/img/bg.jpg')",
          }}
        />
        {/* Lớp tối mờ để chữ dễ đọc */}
        <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-b from-black/40 via-black/20 to-black/90" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-3 sm:px-4 pt-24 pb-14 text-center md:pt-32 md:pb-20">
          <h1 className="max-w-3xl text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow z-2">
            Phim, series không giới hạn
            <br className="hidden md:block" /> và nhiều nội dung khác
          </h1>

          <p className="mt-4 text-sm md:text-lg text-neutral-200 z-2">
            Tìm kiếm phim và TV show yêu thích của bạn từ cơ sở dữ liệu TMDB.
          </p>

          <p className="mt-2 text-xs md:text-sm text-neutral-300 z-2">
            Nhập tên phim / series vào ô bên dưới để bắt đầu tìm kiếm.
          </p>

          {/* ô search + nút kiểu Netflix */}
          <div className="mt-5 flex w-full flex-col items-center gap-3 sm:gap-4 md:flex-row md:justify-center z-2">
            <div className="w-full md:max-w-md">
              <div className="flex items-center overflow-hidden rounded-md border border-neutral-600/80 bg-black/70 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleChangeSearch(e.target.value)}
                  placeholder="Nhập tên phim hoặc TV show..."
                  className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 md:text-base"
                />
              </div>
            </div>

            {/* nút chỉ để giống UI, không bắt buộc phải bấm */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_0_24px_rgba(248,113,113,0.75)] transition hover:bg-red-700 active:scale-[0.98]"
            >
              Bắt đầu
              <span className="ml-1 text-lg">›</span>
            </button>
          </div>

          {hasQuery && (
            <p className="mt-3 text-xs text-neutral-300 z-2">
              Kết quả cho{" "}
              <span className="font-semibold text-red-400">“{query}”</span>
              {allResults.length > 0 && (
                <>
                  {" "}
                  · Trang {page}/{totalPages || 1} · Tổng {allResults.length}{" "}
                  phim/TV
                </>
              )}
            </p>
          )}
        </div>
      </section>

      {/* NỘI DUNG KẾT QUẢ */}
      <div className="mx-auto max-w-6xl px-2 sm:px-3 pb-12 pt-6 md:pt-8">
        {/* chưa gõ gì */}
        {!hasQuery && (
          <div className="mt-10 flex flex-col items-center text-center text-sm text-neutral-400">
            <span className="mb-2 text-4xl">🍿</span>
            <p>Nhập từ khóa ở phía trên để bắt đầu tìm kiếm phim / TV.</p>
          </div>
        )}

        {/* không có kết quả */}
        {hasQuery && !loading && allResults.length === 0 && (
          <div className="mt-10 flex flex-col items-center text-center text-sm text-neutral-400">
            <span className="mb-2 text-4xl">😢</span>
            <p>
              Không tìm thấy kết quả nào cho{" "}
              <span className="font-medium text-red-400">“{query}”</span>.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Thử từ khóa khác ngắn hơn, hoặc thử tiếng Anh / tiếng Việt.
            </p>
          </div>
        )}

        {/* GRID 5 PHIM 1 HÀNG (desktop), 20 phim / page */}
        {currentPageItems.length > 0 && (
          <div className="mt-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {currentPageItems.map((item) => (
                <Card
                  key={item.id + "search"}
                  data={item}
                  media_type={item.media_type}
                />
              ))}
            </div>
          </div>
        )}

        {/* loading */}
        {loading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-neutral-200">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            Đang tải kết quả...
          </div>
        )}

        {/* PHÂN TRANG */}
        {hasQuery && totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!canPrev || loading}
              className="rounded-full border border-neutral-700 px-3 py-1.5 font-medium text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹ Trước
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!canNext || loading}
              className="rounded-full border border-neutral-700 px-3 py-1.5 font-medium text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
