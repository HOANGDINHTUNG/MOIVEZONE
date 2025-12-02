// src/module/movies/pages/AllMoviesPage.tsx

import { useEffect, useState, type JSX } from "react";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import type { MovieSummary } from "../database/interface/movie";
import { tmdbApi } from "../../../api/movie/TMDB.api";
import Card from "../../../components/common/Card";

// 👇 THÊM IMPORT
import TrendingTrailerHeader from "../components/TrendingTrailerHeader";

type MoviesByPage = Record<number, MovieSummary[]>;

const AllMoviesPage = () => {
  const language = useAppSelector((state) => state.language.current);

  const [moviesByPage, setMoviesByPage] = useState<MoviesByPage>({});
  const [currentPage, setCurrentPage] = useState(1); // Trang UI
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang UI
  const [tmdbTotalPages, setTmdbTotalPages] = useState<number | null>(null); // Tổng page TMDB
  const [loading, setLoading] = useState(false);

  // trạng thái để fade in/out grid
  const [gridVisible, setGridVisible] = useState(true);

  // Cuộn lên đầu trang — mượt
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
  // LOAD 40 PHIM MỖI TRANG
  // ---------------------------
  const loadPage = async (uiPage: number) => {
    if (loading) return;

    try {
      // fade-out grid trước
      setGridVisible(false);
      setLoading(true);

      // Mỗi trang UI = 2 trang TMDB (20 * 2 = 40)
      const tmdbPage1 = uiPage * 2 - 1;
      const tmdbPage2 = uiPage * 2;

      let totalFromApi: number | null = tmdbTotalPages;

      let res1: { results: MovieSummary[]; total_pages: number } | null = null;
      let res2: { results: MovieSummary[]; total_pages: number } | null = null;

      // --- Trang đầu ---
      if (totalFromApi === null || tmdbPage1 <= totalFromApi) {
        res1 = await tmdbApi.discoverMovies(tmdbPage1, language);

        if (totalFromApi === null) {
          totalFromApi = res1.total_pages;
          setTmdbTotalPages(totalFromApi);
          setTotalPages(Math.ceil(totalFromApi / 2)); // 2 page TMDB = 1 page UI
        }
      }

      // --- Trang thứ hai ---
      if (totalFromApi !== null && tmdbPage2 <= totalFromApi) {
        res2 = await tmdbApi.discoverMovies(tmdbPage2, language);
      }

      const combined: MovieSummary[] = [];
      if (res1) combined.push(...res1.results);
      if (res2) combined.push(...res2.results);

      // Sort phim mới/hot hơn lên đầu
      combined.sort((a, b) => {
        const da = parseDate(a.release_date);
        const db = parseDate(b.release_date);
        if (db !== da) return db - da;
        return (b.popularity ?? 0) - (a.popularity ?? 0);
      });

      setMoviesByPage((prev) => ({
        ...prev,
        [uiPage]: combined,
      }));

      setCurrentPage(uiPage);
      scrollToTopSmooth();

      // cho grid hiện lại (fade-in)
      setTimeout(() => {
        setGridVisible(true);
      }, 10);
    } catch (error) {
      console.error("Load movies page error:", error);
      // nếu lỗi thì cho grid hiện lại để không bị mất trắng
      setGridVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Khi đổi ngôn ngữ → reset
  useEffect(() => {
    setMoviesByPage({});
    setCurrentPage(1);
    setTotalPages(0);
    setTmdbTotalPages(null);

    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // ---------------------------
  // HANDLE CHANGE PAGE
  // ---------------------------
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (totalPages && newPage > totalPages)) return;

    // Nếu đã có cache thì chỉ set currentPage + fade
    if (moviesByPage[newPage]) {
      setGridVisible(false);
      setCurrentPage(newPage);
      scrollToTopSmooth();

      setTimeout(() => {
        setGridVisible(true);
      }, 10);

      return;
    }

    // chưa có thì load từ API
    loadPage(newPage);
  };

  // ---------------------------
  // RENDER PAGE NUMBERS
  // ---------------------------
  const renderPageNumbers = () => {
    if (!totalPages || totalPages === 1) return null;

    const buttons: JSX.Element[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

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

  const currentMovies = moviesByPage[currentPage] ?? [];

  return (
    <>
      {/* HEADER TRAILER */}
      <TrendingTrailerHeader mode="movie" />

      {/* LIST PHIM */}
      <section className="max-w-6xl mx-auto px-3 py-6">
        {/* Title */}
        <div className="flex flex-col gap-1 mb-4 md:flex-row md:items-baseline md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Phim mới nhất</h1>
            <p className="text-sm text-neutral-500">
              Mỗi trang hiển thị 40 bộ phim. Phim mới và hot hơn sẽ ở phía trên.
            </p>
          </div>

          {totalPages > 1 && (
            <p className="text-xs md:text-sm text-neutral-400 mt-1 md:mt-0">
              Trang{" "}
              <span className="font-semibold text-neutral-200">
                {currentPage}
              </span>
              /{totalPages}
            </p>
          )}
        </div>

        {/* GRID MOVIES + FADE */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 
          transition-opacity duration-300 ${
            gridVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentMovies.map((movie) => (
            <Card key={movie.id} data={movie} media_type="movie" />
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="mt-4 flex justify-center text-sm text-neutral-300 gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            Đang tải phim...
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!canPrev || loading}
              className="rounded-full border border-neutral-700 px-3 py-1.5 font-medium text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹ Trước
            </button>

            {renderPageNumbers()}

            <button
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

export default AllMoviesPage;
