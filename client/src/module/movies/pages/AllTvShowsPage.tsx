// src/module/movies/pages/AllTvShowsPage.tsx

import { useEffect, useState, type JSX } from "react";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";

import Card from "../../../components/common/Card";
import TrendingTrailerHeader from "../components/TrendingTrailerHeader";
import { tmdbDiscoverApi } from "../../../api/movie/TMDBDiscover.api";

// Kiểu TV show dùng cho UI (đủ cho Card + sort)
type UITvShow = {
  id: number;
  name?: string;
  original_name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average?: number;
  popularity?: number;
};

type ShowsByPage = Record<number, UITvShow[]>;

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

  // Mỗi trang UI = 2 trang TMDB (40 TV show)
  const loadPage = async (uiPage: number) => {
    if (loading) return;

    try {
      setGridVisible(false); // fade-out trước
      setLoading(true);

      const tmdbPage1 = uiPage * 2 - 1;
      const tmdbPage2 = uiPage * 2;

      let totalFromApi = tmdbTotalPages;

      let page1Results: UITvShow[] = [];
      let page2Results: UITvShow[] = [];

      // --- Call page 1 ---
      if (totalFromApi === null || tmdbPage1 <= totalFromApi) {
        const res1 = await tmdbDiscoverApi.discoverTvShows(
          tmdbPage1,
          language
        );

        // lần đầu: lấy total_pages từ API
        if (totalFromApi === null) {
          totalFromApi = res1.total_pages;
          setTmdbTotalPages(totalFromApi);
          setTotalPages(Math.ceil(totalFromApi / 2)); // 2 page TMDB = 1 page UI
        }

        page1Results = (res1.results ?? []) as unknown as UITvShow[];
      }

      // --- Call page 2 ---
      if (totalFromApi !== null && tmdbPage2 <= totalFromApi) {
        const res2 = await tmdbDiscoverApi.discoverTvShows(
          tmdbPage2,
          language
        );
        page2Results = (res2.results ?? []) as unknown as UITvShow[];
      }

      const combined: UITvShow[] = [...page1Results, ...page2Results];

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

    void loadPage(1);
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

      <section className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        <header className="mb-6 flex flex-col gap-2 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Tất cả TV show
            </h1>
            <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
              Mỗi trang hiển thị khoảng 40 TV show. TV show mới lên sóng / hot
              hơn sẽ được ưu tiên ở phía trên.
            </p>
          </div>

          {totalPages > 1 && (
            <p className="text-xs text-neutral-400 sm:text-sm">
              Trang{" "}
              <span className="font-semibold text-neutral-100">
                {currentPage}
              </span>
              /{totalPages}
            </p>
          )}
        </header>

        {/* GRID + FADE (responsive 2–3–4–5 cột) */}
        <div
          className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4
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
          <div className="mt-4 flex justify-center gap-2 text-sm text-neutral-300">
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
