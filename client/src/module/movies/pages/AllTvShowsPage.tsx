import { useEffect, useState, type JSX } from "react";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import type { TvSummary } from "../database/interface/tv";

import Card from "../../../components/common/Card";
import TrendingTrailerHeader from "../components/TrendingTrailerHeader";
import { tmdbApi } from "../../../api/movie/TMDB.api";

type ShowsByPage = Record<number, TvSummary[]>;

const AllTvShowsPage = () => {
  const language = useAppSelector((state) => state.language.current);

  const [showsByPage, setShowsByPage] = useState<ShowsByPage>({});
  const [currentPage, setCurrentPage] = useState(1); // trang UI
  const [totalPages, setTotalPages] = useState(0); // tổng trang UI
  const [tmdbTotalPages, setTmdbTotalPages] = useState<number | null>(null); // tổng page TMDB
  const [loading, setLoading] = useState(false);

  // trạng thái để fade grid
  const [gridVisible, setGridVisible] = useState(true);

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

  // Mỗi trang UI = 2 trang TMDB (40 TV show)
  const loadPage = async (uiPage: number) => {
    if (loading) return;

    try {
      setGridVisible(false); // fade-out trước
      setLoading(true);

      const tmdbPage1 = uiPage * 2 - 1;
      const tmdbPage2 = uiPage * 2;

      let totalFromApi: number | null = tmdbTotalPages;

      let res1: { results: TvSummary[]; total_pages: number } | null = null;
      let res2: { results: TvSummary[]; total_pages: number } | null = null;

      // --- Call page 1 ---
      if (totalFromApi === null || tmdbPage1 <= totalFromApi) {
        res1 = await tmdbApi.discoverTvShows(tmdbPage1, language);

        if (totalFromApi === null) {
          totalFromApi = res1.total_pages;
          setTmdbTotalPages(totalFromApi);
          setTotalPages(Math.ceil(totalFromApi / 2)); // 2 page TMDB = 1 page UI
        }
      }

      // --- Call page 2 ---
      if (totalFromApi !== null && tmdbPage2 <= totalFromApi) {
        res2 = await tmdbApi.discoverTvShows(tmdbPage2, language);
      }

      const combined: TvSummary[] = [];
      if (res1) combined.push(...res1.results);
      if (res2) combined.push(...res2.results);

      // Sort: TV show mới / hot hơn lên trên trong 40 cái
      combined.sort((a, b) => {
        const da = parseDate(a.first_air_date);
        const db = parseDate(b.first_air_date);

        if (db !== da) return db - da;
        return (b.popularity ?? 0) - (a.popularity ?? 0);
      });

      setShowsByPage((prev) => ({
        ...prev,
        [uiPage]: combined,
      }));

      setCurrentPage(uiPage);
      scrollToTopSmooth();

      setTimeout(() => {
        setGridVisible(true); // fade-in
      }, 10);
    } catch (error) {
      console.error("Load TV shows page error:", error);
      setGridVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Reset khi đổi language
  useEffect(() => {
    setShowsByPage({});
    setCurrentPage(1);
    setTotalPages(0);
    setTmdbTotalPages(null);

    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (totalPages && newPage > totalPages)) return;

    // Có cache sẵn → không call API, chỉ đổi trang + fade
    if (showsByPage[newPage]) {
      setGridVisible(false);
      setCurrentPage(newPage);
      scrollToTopSmooth();

      setTimeout(() => {
        setGridVisible(true);
      }, 10);

      return;
    }

    // Chưa có → gọi API
    loadPage(newPage);
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
          className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition ${
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

  const currentShows = showsByPage[currentPage] ?? [];

  return (
    <>
      {/* Header trailer dùng chung – mode='tv' */}
      <TrendingTrailerHeader mode="tv" />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Tất cả TV show
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Mỗi trang hiển thị 40 TV show. TV show mới lên sóng / hot hơn sẽ
              được ưu tiên ở phía trên.
            </p>
          </div>

          {totalPages > 1 && (
            <p className="text-xs sm:text-sm text-neutral-400">
              Trang{" "}
              <span className="font-semibold text-neutral-100">
                {currentPage}
              </span>
              /{totalPages}
            </p>
          )}
        </header>

        {/* GRID + FADE */}
        <div
          className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
          transition-opacity duration-300 ${
            gridVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentShows.map((show) => (
            <Card key={show.id} data={show} media_type="tv" />
          ))}
        </div>

        {/* Loading nhỏ */}
        {loading && (
          <div className="mt-4 flex justify-center text-sm text-neutral-300 gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            Đang tải TV show...
          </div>
        )}

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!canPrev || loading}
              className="rounded-full border border-neutral-700 px-3 py-1.5 font-medium text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹ Trước
            </button>

            {renderPageNumbers()}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!canNext || loading}
              className="rounded-full border border-neutral-700 px-3 py-1.5 font-medium text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau ›
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default AllTvShowsPage;
