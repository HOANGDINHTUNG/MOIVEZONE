// src/module/search/pages/SearchPage.tsx
import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";

import {
  fetchSearch,
  resetResults,
  selectSearchState,
  setActiveCategory,
  setQuery,
} from "../store/searchSlice";

import SearchTabs from "../components/SearchTabs";
import MovieTvCard from "../components/MovieTvCard";
import PersonCard from "../components/PersonCard";
import CollectionCard from "../components/CollectionCard";
import CompanyCard from "../components/CompanyCard";
import KeywordPill from "../components/KeywordPill";
import type { SearchCategory } from "../../../api/movie/TMDBSearch.api";

import bgImg from "../../../../public/assets/img/bg.jpg";

// ====== IMPORT TYPE TMDB SEARCH ======
import type {
  TMDBSearchMovieItem,
  TMDBSearchTvItem,
  TMDBSearchPersonItem,
  TMDBSearchCollectionItem,
  TMDBSearchCompanyItem,
  TMDBSearchKeywordItem,
  TMDBSearchMultiMovie,
  TMDBSearchMultiTv,
  TMDBSearchMultiPerson,
} from "../database/interface/search";

// Kết quả chung cho mọi category (dùng cho hasResults)
type SearchResultItem =
  | TMDBSearchMovieItem
  | TMDBSearchTvItem
  | TMDBSearchPersonItem
  | TMDBSearchCollectionItem
  | TMDBSearchCompanyItem
  | TMDBSearchKeywordItem
  | TMDBSearchMultiMovie
  | TMDBSearchMultiTv
  | TMDBSearchMultiPerson;

// Kết quả riêng cho grid Movie / TV / Multi
type MovieTvSearchItem =
  | TMDBSearchMovieItem
  | TMDBSearchTvItem
  | TMDBSearchMultiMovie
  | TMDBSearchMultiTv;

const SearchAdvancedPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    query,
    activeCategory,
    page,
    loading,
    error,
    movieResults,
    tvResults,
    personResults,
    collectionResults,
    companyResults,
    keywordResults,
    multiResults,
    totalPagesByCategory,
    totalResultsByCategory,
  } = useAppSelector(selectSearchState);

  const [localInput, setLocalInput] = useState(query);

  // trạng thái cho animation mượt khi đổi tab / page
  const [gridVisible, setGridVisible] = useState(true);

  // helper: scroll mượt lên đầu trang
  const scrollToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // lấy query từ URL (?q=xxx)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (q && q !== query) {
      dispatch(setQuery(q));
      setLocalInput(q);
      dispatch(fetchSearch({ query: q, category: activeCategory, page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // khi đổi tab hoặc đổi page => bật animation fade/slide nhẹ
  useEffect(() => {
    setGridVisible(false);
    const timer = setTimeout(() => {
      setGridVisible(true);
    }, 50); // delay nhỏ cho transition nhìn rõ
    return () => clearTimeout(timer);
  }, [activeCategory, page]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = localInput.trim();
      if (!trimmed) return;

      // sync URL
      const params = new URLSearchParams(location.search);
      params.set("q", trimmed);
      navigate(
        { pathname: location.pathname, search: params.toString() },
        { replace: true }
      );

      dispatch(resetResults());
      dispatch(setQuery(trimmed));
      dispatch(
        fetchSearch({ query: trimmed, category: activeCategory, page: 1 })
      );
      scrollToTopSmooth();
    },
    [
      localInput,
      dispatch,
      activeCategory,
      location.pathname,
      location.search,
      navigate,
    ]
  );

  const handleTabChange = (cat: SearchCategory) => {
    dispatch(setActiveCategory(cat));
    if (!query) return;
    dispatch(fetchSearch({ category: cat, page: 1 }));
    scrollToTopSmooth();
  };

  const currentTotalPages = totalPagesByCategory[activeCategory] ?? 0;
  const currentTotalResults = totalResultsByCategory[activeCategory] ?? 0;

  // Mảng kết quả chung cho từng category (dùng để check hasResults)
  const results: SearchResultItem[] = useMemo(() => {
    switch (activeCategory) {
      case "movie":
        return movieResults as SearchResultItem[];
      case "tv":
        return tvResults as SearchResultItem[];
      case "person":
        return personResults as SearchResultItem[];
      case "collection":
        return collectionResults as SearchResultItem[];
      case "company":
        return companyResults as SearchResultItem[];
      case "keyword":
        return keywordResults as SearchResultItem[];
      case "multi":
      default:
        return multiResults as SearchResultItem[];
    }
  }, [
    activeCategory,
    movieResults,
    tvResults,
    personResults,
    collectionResults,
    companyResults,
    keywordResults,
    multiResults,
  ]);

  const hasResults = results.length > 0;

  // Mảng riêng cho grid movie/tv/multi (không dùng any)
  const movieTvItems: MovieTvSearchItem[] = useMemo(() => {
    if (activeCategory === "movie") {
      return movieResults;
    }
    if (activeCategory === "tv") {
      return tvResults;
    }
    if (activeCategory === "multi") {
      // lọc chỉ giữ movie & tv trong multi
      return multiResults.filter(
        (item): item is TMDBSearchMultiMovie | TMDBSearchMultiTv =>
          item.media_type === "movie" || item.media_type === "tv"
      );
    }
    return [];
  }, [activeCategory, movieResults, tvResults, multiResults]);

  const handleLoadMore = () => {
    if (!query) return;
    if (page >= (currentTotalPages || 1)) return;
    dispatch(fetchSearch({ category: activeCategory, page: page + 1 }));
    scrollToTopSmooth();
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white">
      {/* background blur đẹp mắt */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 blur-sm"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-black via-neutral-950/90 to-black" />

      <main className="mx-auto flex max-w-6xl flex-col px-4 pb-16 pt-24 md:px-6 lg:px-8">
        {/* Hero search */}
        <section className="rounded-3xl border border-neutral-800/80 bg-neutral-900/60 p-4 shadow-[0_0_90px_-40px_rgba(16,185,129,0.9)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-black/70 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                smart search powered by TMDB
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-4xl">
                Tìm kiếm mọi thứ về{" "}
                <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                  Movies, TV, People & more.
                </span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-neutral-300 md:text-base">
                Gõ tên movie, TV show, diễn viên, hãng sản xuất, bộ sưu tập
                hoặc từ khóa. Hệ thống sẽ tự động phân loại kết quả cho bạn.
              </p>
            </div>
          </div>

          {/* ô search */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-2 rounded-2xl bg-black/60 p-2 ring-1 ring-neutral-800/80 backdrop-blur md:flex-row md:items-center"
          >
            <div className="relative flex-1">
              <input
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                className="h-11 w-full rounded-xl border-none bg-transparent px-3 pr-10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 md:h-12 md:text-base"
                placeholder="Search for a movie, TV show, person, company, collection or keyword..."
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-500">
                ⌘K
              </span>
            </div>
            <button
              type="submit"
              className="flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 text-sm font-semibold text-black shadow-lg shadow-emerald-500/40 transition hover:brightness-110 active:scale-[0.98] md:h-12 md:px-6"
            >
              Search
            </button>
          </form>

          {/* Tabs */}
          <SearchTabs active={activeCategory} onChange={handleTabChange} />

          {/* info dòng nhỏ */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
            <span>
              {query
                ? `Showing results for “${query}”`
                : "Type something to start searching"}
            </span>
            {currentTotalResults > 0 && (
              <span>
                {currentTotalResults.toLocaleString()} results · Page {page} /{" "}
                {currentTotalPages || 1}
              </span>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="mt-8">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 rounded-full bg-black/60 px-4 py-2 text-sm text-neutral-300 ring-1 ring-neutral-800/80">
                <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                <span>Đang tìm kiếm, chờ xíu...</span>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && query && !hasResults && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-neutral-800 bg-black/50 px-6 py-12 text-center">
              <span className="text-3xl">🔍</span>
              <p className="text-sm text-neutral-300">
                Không tìm thấy kết quả cho “{query}”.
              </p>
              <p className="text-xs text-neutral-500">
                Thử tên khác ngắn hơn, hoặc chuyển sang tab{" "}
                <span className="text-emerald-400 font-medium">All</span>.
              </p>
            </div>
          )}

          {/* Wrapper animation cho khối kết quả */}
          <div
            className={`transition-all duration-300 ${
              gridVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {hasResults && (
              <>
                {/* grid / list tuỳ category */}
                {["movie", "tv", "multi"].includes(activeCategory) && (
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                    {movieTvItems.map((item) => (
                      <MovieTvCard
                        key={
                          item.id +
                          ("media_type" in item ? item.media_type : "")
                        }
                        item={item}
                        // onClick => navigate đến chi tiết
                        onClick={() => {
                          // Kết quả từ /search/multi có media_type
                          if ("media_type" in item) {
                            if (item.media_type === "tv") {
                              navigate(`/tv/${item.id}`);
                            } else {
                              navigate(`/movie/${item.id}`);
                            }
                            return;
                          }

                          // Kết quả từ /search/movie hoặc /search/tv không có media_type
                          if ("title" in item) {
                            navigate(`/movie/${item.id}`);
                          } else {
                            navigate(`/tv/${item.id}`);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}

                {activeCategory === "person" && (
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                    {personResults.map((item) => (
                      <PersonCard
                        key={item.id}
                        item={item}
                        onClick={() => navigate(`/person/${item.id}`)}
                      />
                    ))}
                  </div>
                )}

                {activeCategory === "collection" && (
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {collectionResults.map((item: TMDBSearchCollectionItem) => (
                      <CollectionCard key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {activeCategory === "company" && (
                  <div className="mt-4 flex flex-col gap-3">
                    {companyResults.map((item: TMDBSearchCompanyItem) => (
                      <CompanyCard key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {activeCategory === "keyword" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {keywordResults.map((item: TMDBSearchKeywordItem) => (
                      <KeywordPill key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {/* phân trang */}
                {currentTotalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={page <= 1 || loading}
                      onClick={() => {
                        if (page <= 1) return;
                        dispatch(
                          fetchSearch({
                            category: activeCategory,
                            page: page - 1,
                          })
                        );
                        scrollToTopSmooth();
                      }}
                      className="rounded-full border border-neutral-700 bg-neutral-900/80 px-4 py-2 text-xs font-medium text-neutral-200 transition hover:border-emerald-500 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-neutral-400">
                      Page{" "}
                      <span className="font-semibold text-emerald-300">
                        {page}
                      </span>{" "}
                      / {currentTotalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= currentTotalPages || loading}
                      onClick={handleLoadMore}
                      className="rounded-full bg-emerald-500/90 px-4 py-2 text-xs font-semibold text-black shadow shadow-emerald-500/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SearchAdvancedPage;
