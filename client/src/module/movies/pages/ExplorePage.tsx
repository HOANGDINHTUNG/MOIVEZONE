import { useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import axiosTMDB from "../../../app/axiosTMDB";
import Card from "../../../components/common/Card";

import ExploreBackdropHeader from "../components/ExploreBackdropHeader";
import type { TMDBMovieSummary } from "../database/interface/movie";
import type { TMDBTvSummary } from "../database/interface/tvList";
import type { TMDBListResponse } from "../database/interface/movieLists";

// Dữ liệu cho Card: có thể là movie hoặc tv summary
type CardMovie = TMDBMovieSummary | TMDBTvSummary;
type ItemsByPage = Record<number, CardMovie[]>;

const ExplorePage = () => {
  // param :explore -> "movie" | "tv"
  const { explore } = useParams<"explore">();

  // Chuẩn hóa về 2 loại duy nhất
  const mediaType: "movie" | "tv" = explore === "tv" ? "tv" : "movie";

  // state phân trang
  const [itemsByPage, setItemsByPage] = useState<ItemsByPage>({});
  const [currentPage, setCurrentPage] = useState(1); // trang UI
  const [totalPages, setTotalPages] = useState(0); // tổng trang UI
  const [tmdbTotalPages, setTmdbTotalPages] = useState<number | null>(null); // tổng page TMDB
  const [loading, setLoading] = useState(false);

  // hiệu ứng fade grid
  const [gridVisible, setGridVisible] = useState(true);

  // detect mobile để giới hạn item render (39 item)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // < 640px (theo breakpoint sm của Tailwind) coi là mobile
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // chạy lần đầu
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const parseDate = (dateStr?: string | null): number => {
    if (!dateStr) return 0;
    const t = Date.parse(dateStr);
    return Number.isNaN(t) ? 0 : t;
  };

  // ---------------------------
  // LOAD 40 ITEM MỖI TRANG
  // ---------------------------
  const loadPage = async (uiPage: number) => {
    if (loading) return;

    try {
      setGridVisible(false); // fade-out trước
      setLoading(true);

      // 1 trang UI = 2 trang TMDB (20 * 2 = 40)
      const tmdbPage1 = uiPage * 2 - 1;
      const tmdbPage2 = uiPage * 2;

      let totalFromApi: number | null = tmdbTotalPages;

      let res1: TMDBListResponse<TMDBMovieSummary | TMDBTvSummary> | null =
        null;
      let res2: TMDBListResponse<TMDBMovieSummary | TMDBTvSummary> | null =
        null;

      // helper gọi TMDB theo mediaType
      const fetchPage = async (
        page: number
      ): Promise<TMDBListResponse<TMDBMovieSummary | TMDBTvSummary>> => {
        if (mediaType === "movie") {
          const res = await axiosTMDB.get<TMDBListResponse<TMDBMovieSummary>>(
            `/discover/movie`,
            {
              params: {
                page,
                sort_by: "popularity.desc",
              },
            }
          );
          return res.data;
        } else {
          const res = await axiosTMDB.get<TMDBListResponse<TMDBTvSummary>>(
            `/discover/tv`,
            {
              params: {
                page,
                sort_by: "popularity.desc",
              },
            }
          );
          return res.data;
        }
      };

      // --- Trang TMDB 1 ---
      if (totalFromApi === null || tmdbPage1 <= totalFromApi) {
        res1 = await fetchPage(tmdbPage1);

        if (totalFromApi === null) {
          totalFromApi = res1.total_pages;
          setTmdbTotalPages(totalFromApi);
          setTotalPages(Math.ceil(totalFromApi / 2)); // 2 page TMDB = 1 page UI
        }
      }

      // --- Trang TMDB 2 ---
      if (totalFromApi !== null && tmdbPage2 <= totalFromApi) {
        res2 = await fetchPage(tmdbPage2);
      }

      const combined: CardMovie[] = [];
      if (res1) combined.push(...(res1.results as CardMovie[]));
      if (res2) combined.push(...(res2.results as CardMovie[]));

      // sort theo ngày phát hành + popularity
      combined.sort((a, b) => {
        let da = 0;
        let db = 0;

        if (mediaType === "movie") {
          da = parseDate((a as TMDBMovieSummary).release_date);
          db = parseDate((b as TMDBMovieSummary).release_date);
        } else {
          da = parseDate((a as TMDBTvSummary).first_air_date);
          db = parseDate((b as TMDBTvSummary).first_air_date);
        }

        if (db !== da) return db - da;
        return (b.popularity ?? 0) - (a.popularity ?? 0);
      });

      setItemsByPage((prev) => ({
        ...prev,
        [uiPage]: combined,
      }));

      setCurrentPage(uiPage);
      scrollToTopSmooth();

      setTimeout(() => {
        setGridVisible(true); // fade-in
      }, 10);
    } catch (error) {
      console.error("ExplorePage error:", error);
      setGridVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Khi mediaType đổi (movie <-> tv) -> reset + load trang 1
  useEffect(() => {
    setItemsByPage({});
    setCurrentPage(1);
    setTotalPages(0);
    setTmdbTotalPages(null);

    void loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (totalPages && newPage > totalPages)) return;

    // nếu đã có cache thì chỉ set currentPage + fade
    if (itemsByPage[newPage]) {
      setGridVisible(false);
      setCurrentPage(newPage);
      scrollToTopSmooth();

      setTimeout(() => {
        setGridVisible(true);
      }, 10);

      return;
    }

    // chưa có thì gọi API
    void loadPage(newPage);
  };

  const renderPageNumbers = () => {
    if (!totalPages || totalPages === 1) return null;

    const buttons: JSX.Element[] = [];
    const maxButtons = 5;

    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let p = start; p <= end; p++) {
      buttons.push(
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition 
          ${
            p === currentPage
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

  const canPrev = currentPage > 1;
  const canNext = totalPages ? currentPage < totalPages : false;

  const currentItems = itemsByPage[currentPage] ?? [];

  // 🔥 mobile chỉ render 39 item để grid 3 cột đẹp, desktop/tablet render full
  const itemsForGrid = isMobile ? currentItems.slice(0, 39) : currentItems;

  const headingLabel = mediaType === "movie" ? "Movies" : "TV Shows";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* HEADER BACKDROP 3D */}
      <ExploreBackdropHeader />

      {/* CONTENT WRAPPER */}
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* TITLE + INFO */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold capitalize text-neutral-100">
              Explore {headingLabel}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
              Khám phá danh sách {headingLabel.toLowerCase()} được sắp xếp theo
              ngày phát hành và độ nổi bật.
            </p>
          </div>

          {totalPages > 1 && (
            <p className="text-xs sm:text-sm text-neutral-400">
              Trang{" "}
              <span className="font-semibold text-neutral-50">
                {currentPage}
              </span>
              /{totalPages}
            </p>
          )}
        </div>

        {/* GRID + FADE */}
        <div
          className={`grid grid-cols-3 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
          transition-opacity duration-300 ${
            gridVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {itemsForGrid.map((item) => (
            <Card
              key={item.id + "exploreSection"}
              data={item}
              media_type={mediaType}
            />
          ))}
        </div>

        {/* Loading nhỏ */}
        {loading && (
          <div className="mt-4 flex justify-center gap-2 text-xs sm:text-sm text-neutral-300">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <span>Đang tải...</span>
          </div>
        )}

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3 text-xs sm:text-sm">
            {/* Hàng chứa cả Prev / numbers / Next */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* Prev button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!canPrev || loading}
                className="rounded-full border border-neutral-600 px-4 py-1.5 font-medium 
                text-neutral-100 transition hover:bg-neutral-800 
                disabled:cursor-not-allowed disabled:opacity-50"
              >
                ‹ Trước
              </button>

              {/* Page numbers */}
              <div className="flex flex-wrap justify-center gap-2">
                {renderPageNumbers()}
              </div>

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!canNext || loading}
                className="rounded-full border border-neutral-600 px-4 py-1.5 font-medium 
                text-neutral-100 transition hover:bg-neutral-800 
                disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
