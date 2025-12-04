import { useEffect, useState, type JSX } from "react";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import Card from "../../../components/common/Card";

import TrendingTrailerHeader from "../components/TrendingTrailerHeader";
import { tmdbDiscoverApi } from "../../../api/movie/TMDBDiscover.api";

// Kiểu movie dùng cho UI (đủ cho Card + sort)
type UIMovie = {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average?: number;
  popularity?: number;
};

type MoviesByPage = Record<number, UIMovie[]>;

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
    if (typeof window === "undefined") return;
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
  // LOAD 40 PHIM MỖI TRANG UI
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

      let totalFromApi = tmdbTotalPages;

      let page1Results: UIMovie[] = [];
      let page2Results: UIMovie[] = [];

      // --- Trang TMDB 1 ---
      if (totalFromApi === null || tmdbPage1 <= totalFromApi) {
        const res1 = await tmdbDiscoverApi.discoverMovies(tmdbPage1, language);

        // Lần đầu: lấy total_pages từ API
        if (totalFromApi === null) {
          totalFromApi = res1.total_pages;
          setTmdbTotalPages(totalFromApi);
          setTotalPages(Math.ceil(totalFromApi / 2)); // 2 page TMDB = 1 page UI
        }

        page1Results = (res1.results ?? []) as unknown as UIMovie[];
      }

      // --- Trang TMDB 2 ---
      if (totalFromApi !== null && tmdbPage2 <= totalFromApi) {
        const res2 = await tmdbDiscoverApi.discoverMovies(tmdbPage2, language);
        page2Results = (res2.results ?? []) as unknown as UIMovie[];
      }

      // Gộp lại
      const combined: UIMovie[] = [...page1Results, ...page2Results];

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

    void loadPage(1);
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
    void loadPage(newPage);
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
      {/* HEADER TRAILER (full width, responsive) */}
      <TrendingTrailerHeader mode="movie" />

      {/* LIST PHIM */}
      <section className="mx-auto max-w-6xl px-3 pb-8 pt-4 sm:pb-10 sm:pt-6 md:pb-12">
        {/* Title + info */}
        <div className="mb-4 flex flex-col gap-1 md:mb-5 md:flex-row md:items-baseline md:justify-between">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
              Phim mới nhất
            </h1>
            <p className="text-xs text-neutral-500 sm:text-sm">
              Mỗi trang hiển thị khoảng 40 bộ phim. Phim mới và hot hơn sẽ ở
              phía trên.
            </p>
          </div>

          {totalPages > 1 && (
            <p className="mt-1 text-xs text-neutral-400 md:mt-0 md:text-sm">
              Trang{" "}
              <span className="font-semibold text-neutral-200">
                {currentPage}
              </span>
              /{totalPages}
            </p>
          )}
        </div>

        {/* GRID MOVIES + FADE (responsive 2–3–4–5 cột) */}
        <div
          className={`
            grid gap-3 sm:gap-4
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            transition-opacity duration-300
            ${gridVisible ? "opacity-100" : "opacity-0"}
          `}
        >
          {currentMovies.map((movie) => (
            <Card key={movie.id} data={movie} media_type="movie" />
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="mt-4 flex justify-center gap-2 text-sm text-neutral-300">
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
