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

import axiosTMDB from "../../../app/axiosTMDB";
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

const IMAGE_BASE = "https://image.tmdb.org/t/p";

// ================== TYPE CHUNG SEARCH CŨ ==================
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

type MovieTvSearchItem =
  | TMDBSearchMovieItem
  | TMDBSearchTvItem
  | TMDBSearchMultiMovie
  | TMDBSearchMultiTv;

// ================== TYPE CHO DISCOVER (GENRE & COUNTRY) ==================
interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBCountry {
  iso_3166_1: string;
  english_name: string;
  native_name?: string;
}

interface TMDBDiscoverMovieResponse {
  page: number;
  results: TMDBSearchMovieItem[];
  total_pages: number;
  total_results: number;
}

type DiscoverParams = {
  page: number;
  language: string;
  include_adult: boolean;
  sort_by: string;
  with_genres?: number;
  with_origin_country?: string;
};

// ================== COMPONENT CHÍNH ==================
const SearchAdvancedPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ====== REDUX SEARCH STATE CŨ ======
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
  const [gridVisible, setGridVisible] = useState(true);

  // ====== DISCOVER STATE (THỂ LOẠI & QUỐC GIA – MOVIE) ======
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [countries, setCountries] = useState<TMDBCountry[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [discoverSortBy, setDiscoverSortBy] =
    useState<string>("popularity.desc");

  const [discoverMovies, setDiscoverMovies] = useState<TMDBSearchMovieItem[]>(
    []
  );
  const [discoverPage, setDiscoverPage] = useState(1);
  const [discoverTotalPages, setDiscoverTotalPages] = useState(1);
  const [discoverTotalResults, setDiscoverTotalResults] = useState(0);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [discoverVisible, setDiscoverVisible] = useState(true);

  // ====== COMMON HELPERS ======
  const scrollToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";

    // Sync URL -> localInput + redux query
    if (q !== query) {
      setLocalInput(q);
      dispatch(setQuery(q));

      if (!q) {
        // nếu xóa query trên URL thì clear luôn kết quả
        dispatch(resetResults());
      }
    }
  }, [location.search, query, dispatch]);

  useEffect(() => {
    const trimmed = localInput.trim();
    const t = setTimeout(() => {
      if (trimmed) {
        dispatch(setQuery(trimmed));
        dispatch(
          fetchSearch({ query: trimmed, category: activeCategory, page: 1 })
        );
      } else {
        dispatch(setQuery(""));
        dispatch(resetResults());
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(t);
  }, [localInput, activeCategory, dispatch]);

  // animation cho grid search
  useEffect(() => {
    setGridVisible(false);
    const timer = setTimeout(() => {
      setGridVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [activeCategory, page]);

  // ====== SUBMIT SEARCH TEXT (SEARCH CŨ) ======
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = localInput.trim();
      if (!trimmed) return;

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
    scrollToTopSmooth();
  };

  const currentTotalPages = totalPagesByCategory[activeCategory] ?? 0;
  const currentTotalResults = totalResultsByCategory[activeCategory] ?? 0;

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

  const movieTvItems: MovieTvSearchItem[] = useMemo(() => {
    if (activeCategory === "movie") {
      return movieResults;
    }
    if (activeCategory === "tv") {
      return tvResults;
    }
    if (activeCategory === "multi") {
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

  // ================== DISCOVER: LẤY GENRES & COUNTRIES ==================
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [genreRes, countryRes] = await Promise.all([
          axiosTMDB.get<{ genres: TMDBGenre[] }>("/genre/movie/list", {
            params: { language: "vi-VN" },
          }),
          axiosTMDB.get<TMDBCountry[]>("/configuration/countries"),
        ]);
        setGenres(genreRes.data.genres || []);
        setCountries(countryRes.data || []);
      } catch (err) {
        console.error(err);
        setDiscoverError("Không tải được danh sách thể loại / quốc gia.");
      }
    };

    fetchMeta();
  }, []);

  // ================== DISCOVER: FETCH MOVIES THEO FILTER ==================
  const fetchDiscoverMovies = useCallback(
    async (pageToLoad: number) => {
      setDiscoverLoading(true);
      setDiscoverError(null);
      setDiscoverVisible(false);
      try {
        const params: DiscoverParams = {
          page: pageToLoad,
          language: "vi-VN",
          include_adult: false,
          sort_by: discoverSortBy,
        };

        if (selectedGenreId) {
          params.with_genres = selectedGenreId;
        }
        if (selectedCountry) {
          params.with_origin_country = selectedCountry;
        }

        const res = await axiosTMDB.get<TMDBDiscoverMovieResponse>(
          "/discover/movie",
          { params }
        );

        setDiscoverMovies(res.data.results || []);
        setDiscoverTotalPages(res.data.total_pages || 1);
        setDiscoverTotalResults(res.data.total_results || 0);
        setDiscoverPage(res.data.page || pageToLoad);

        setTimeout(() => setDiscoverVisible(true), 40);
      } catch (err) {
        console.error(err);
        setDiscoverError("Lỗi khi tải danh sách phim Discover.");
      } finally {
        setDiscoverLoading(false);
      }
    },
    [selectedGenreId, selectedCountry, discoverSortBy]
  );

  // load discover lần đầu (không filter gì => phim phổ biến)
  useEffect(() => {
    fetchDiscoverMovies(1);
  }, [fetchDiscoverMovies]);

  // khi đổi filter Discover → về page 1
  useEffect(() => {
    fetchDiscoverMovies(1);
  }, [selectedGenreId, selectedCountry, discoverSortBy, fetchDiscoverMovies]);

  const currentGenreName =
    selectedGenreId == null
      ? "Tất cả thể loại"
      : genres.find((g) => g.id === selectedGenreId)?.name ||
        "Thể loại không xác định";

  const currentCountryName =
    selectedCountry === ""
      ? "Tất cả quốc gia"
      : countries.find((c) => c.iso_3166_1 === selectedCountry)?.english_name ||
        selectedCountry;

  const discoverPageNumbers = useMemo(() => {
    const maxButtons = 7;
    const pages: number[] = [];
    let start = Math.max(1, discoverPage - 3);
    const end = Math.min(discoverTotalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }
    for (let p = start; p <= end; p += 1) pages.push(p);
    return pages;
  }, [discoverPage, discoverTotalPages]);

  const handleDiscoverChangePage = (newPage: number) => {
    if (newPage < 1 || newPage > discoverTotalPages || newPage === discoverPage)
      return;
    fetchDiscoverMovies(newPage);
    scrollToTopSmooth();
  };

  // ================== RENDER ==================
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* background tổng thể đỏ - vàng - đen */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-black" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-red-900/70 via-black to-amber-900/70 opacity-90" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(248,250,252,0.14),transparent_60%)]" />

      <main className="mx-auto flex max-w-7xl flex-col px-4 pb-20 pt-24 md:px-6 lg:px-10">
        {/* ========== HERO + SEARCH TEXT ========== */}
        <section className="rounded-3xl border border-red-700/50 bg-black/85 p-5 shadow-[0_0_140px_-50px_rgba(248,113,113,0.9)] backdrop-blur-md md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-900/80 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-300 ring-1 ring-red-500/60 shadow shadow-red-900/80">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                MovieZone · Smart Search
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                Tìm kiếm{" "}
                <span className="bg-linear-to-r from-red-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  Movies, TV, People
                </span>{" "}
                & hơn thế nữa.
              </h1>
              <p className="text-sm text-neutral-300 md:text-base">
                Gõ tên phim, TV show, diễn viên, hãng sản xuất, bộ sưu tập hoặc
                từ khóa. Hệ thống TMDB sẽ trả về kết quả theo từng tab riêng.
              </p>
            </div>
          </div>

          {/* ô search */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-2 rounded-2xl bg-black/70 p-2 ring-1 ring-neutral-800/90 backdrop-blur md:flex-row md:items-center"
          >
            <div className="relative flex-1">
              <input
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                className="h-11 w-full rounded-xl border-none bg-transparent px-3 pr-10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 md:h-12 md:text-base"
                placeholder="Search for a movie, TV show, person, company, collection or keyword..."
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-500 text-[11px]">
                ⌘K
              </span>
            </div>
            <button
              type="submit"
              className="flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-red-500 via-amber-400 to-yellow-300 px-5 text-sm font-semibold text-black shadow-lg shadow-red-600/40 transition hover:brightness-110 active:scale-[0.97] md:h-12 md:px-7"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Tabs cũ nhưng re-style màu đỏ vàng */}
          <SearchTabs active={activeCategory} onChange={handleTabChange} />

          {/* info nhỏ */}
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

        {/* ========== SEARCH RESULT CŨ (THEO TAB) ========== */}
        <section className="mt-8">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 rounded-full border border-red-700/70 bg-black/85 px-4 py-2 text-sm text-amber-100 shadow shadow-red-900/80">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                <span>Đang tìm kiếm, chờ xíu...</span>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-500/60 bg-red-900/40 p-4 text-sm text-red-50">
              {error}
            </div>
          )}

          {!loading && !error && query && !hasResults && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-neutral-700 bg-black/70 px-6 py-12 text-center">
              <span className="text-3xl">🔍</span>
              <p className="text-sm text-neutral-300">
                Không tìm thấy kết quả cho “{query}”.
              </p>
              <p className="text-xs text-neutral-500">
                Thử tên khác ngắn hơn, hoặc chuyển sang tab{" "}
                <span className="font-semibold text-amber-300">All</span>.
              </p>
            </div>
          )}

          <div
            className={`transition-all duration-300 ${
              gridVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {hasResults && (
              <>
                {["movie", "tv", "multi"].includes(activeCategory) && (
                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {movieTvItems.map((item) => (
                      <MovieTvCard
                        key={
                          item.id +
                          ("media_type" in item ? item.media_type : "")
                        }
                        item={item}
                        onClick={() => {
                          if ("media_type" in item) {
                            if (item.media_type === "tv") {
                              navigate(`/tv/${item.id}`);
                            } else {
                              navigate(`/movie/${item.id}`);
                            }
                            return;
                          }

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
                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
                    {collectionResults.map((item) => (
                      <CollectionCard key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {activeCategory === "company" && (
                  <div className="mt-4 flex flex-col gap-3">
                    {companyResults.map((item) => (
                      <CompanyCard key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {activeCategory === "keyword" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {keywordResults.map((item) => (
                      <KeywordPill key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {/* pagination cũ */}
                {currentTotalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3 text-xs">
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
                      className="rounded-full border border-neutral-700 bg-neutral-950/85 px-4 py-2 font-medium text-neutral-200 transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-neutral-400">
                      Page{" "}
                      <span className="font-semibold text-amber-300">
                        {page}
                      </span>{" "}
                      / {currentTotalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= currentTotalPages || loading}
                      onClick={handleLoadMore}
                      className="rounded-full bg-linear-to-r from-red-500 via-amber-400 to-yellow-300 px-4 py-2 font-semibold text-black shadow shadow-red-600/50 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ========== DISCOVER THEO THỂ LOẠI & QUỐC GIA (MOVIE) ========== */}
        <section className="mt-14">
          <div className="flex flex-col gap-4 rounded-3xl border border-red-700/50 bg-black/85 p-5 shadow-[0_0_120px_-50px_rgba(248,113,113,0.9)] md:flex-row md:items-center md:justify-between md:p-7">
            <div className="max-w-2xl space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Khám phá theo thể loại & quốc gia
              </p>
              <h2 className="text-2xl font-bold md:text-3xl">
                <span className="bg-linear-to-r from-red-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  Discover Movies
                </span>{" "}
                phù hợp với gu của bạn
              </h2>
              <p className="text-sm text-neutral-300">
                Chọn thể loại, quốc gia sản xuất và cách sắp xếp. Không cần nhập
                từ khóa – hệ thống sẽ tự động gợi ý phim cho bạn.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
                <span className="rounded-full border border-red-600/70 bg-red-900/40 px-3 py-1">
                  🎬 {currentGenreName}
                </span>
                <span className="rounded-full border border-amber-600/70 bg-amber-900/40 px-3 py-1">
                  🌍 {currentCountryName}
                </span>
                {discoverTotalResults > 0 && (
                  <span className="rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-1">
                    {discoverTotalResults.toLocaleString()} titles
                  </span>
                )}
              </div>
            </div>

            <div className="mt-2 w-full max-w-xs rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 text-xs text-neutral-200 shadow-lg md:mt-0">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Sắp xếp
              </p>
              <select
                value={discoverSortBy}
                onChange={(e) => setDiscoverSortBy(e.target.value)}
                className="w-full rounded-xl border border-red-700/70 bg-black/90 px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
              >
                <option value="popularity.desc">
                  Độ phổ biến (cao → thấp)
                </option>
                <option value="popularity.asc">Độ phổ biến (thấp → cao)</option>
                <option value="vote_average.desc">
                  Điểm đánh giá (cao → thấp)
                </option>
                <option value="release_date.desc">
                  Ngày phát hành (mới nhất)
                </option>
                <option value="release_date.asc">
                  Ngày phát hành (cũ nhất)
                </option>
              </select>
              <p className="mt-2 text-[11px] text-neutral-500">
                Dữ liệu Discover chỉ áp dụng cho{" "}
                <span className="font-semibold text-amber-300">Movies</span>.
              </p>
            </div>
          </div>

          {/* FILTER BAR: GENRES + COUNTRIES */}
          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-start">
            {/* GENRES */}
            <div className="rounded-3xl border border-red-700/50 bg-black/85 p-3 md:p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Thể loại
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedGenreId(null)}
                  className="text-[11px] text-amber-300 hover:text-yellow-300"
                >
                  Reset thể loại
                </button>
              </div>
              <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedGenreId(null)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                    selectedGenreId === null
                      ? "bg-linear-to-r from-red-500 via-amber-400 to-yellow-300 text-black shadow-md shadow-red-600/50"
                      : "border border-red-600/60 bg-neutral-950/80 text-neutral-200 hover:border-amber-400/80 hover:text-amber-300"
                  }`}
                >
                  Tất cả
                </button>
                {genres.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() =>
                      setSelectedGenreId((prev) =>
                        prev === g.id ? null : g.id
                      )
                    }
                    className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                      selectedGenreId === g.id
                        ? "bg-linear-to-r from-red-500 via-amber-400 to-yellow-300 text-black shadow-md shadow-red-600/50"
                        : "border border-red-600/60 bg-neutral-950/80 text-neutral-200 hover:border-amber-400/80 hover:text-amber-300"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* COUNTRIES */}
            <div className="rounded-3xl border border-amber-600/60 bg-black/85 p-3 md:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Quốc gia sản xuất
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedCountry("")}
                  className="text-[11px] text-amber-300 hover:text-yellow-300"
                >
                  Reset quốc gia
                </button>
              </div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-xl border border-amber-600/70 bg-neutral-950/90 px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
              >
                <option value="">Tất cả quốc gia</option>
                {countries.map((c) => (
                  <option key={c.iso_3166_1} value={c.iso_3166_1}>
                    {c.english_name} ({c.iso_3166_1})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[11px] text-neutral-500">
                Một số phim có nhiều quốc gia cùng hợp tác sản xuất.
              </p>
            </div>
          </div>

          {/* DISCOVER RESULTS */}
          <div className="mt-6">
            {discoverLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 rounded-full border border-red-700/70 bg-black/85 px-4 py-2 text-sm text-amber-100 shadow shadow-red-900/80">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                  <span>Đang tải phim Discover...</span>
                </div>
              </div>
            )}

            {discoverError && (
              <div className="rounded-2xl border border-red-500/60 bg-red-900/40 p-4 text-sm text-red-50">
                {discoverError}
              </div>
            )}

            {!discoverLoading &&
              !discoverError &&
              discoverMovies.length === 0 && (
                <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-neutral-700 bg-black/70 px-6 py-12 text-center">
                  <span className="text-3xl">😶‍🌫️</span>
                  <p className="text-sm text-neutral-300">
                    Không tìm thấy phim phù hợp với bộ lọc Discover hiện tại.
                  </p>
                  <p className="text-xs text-neutral-500">
                    Hãy thử chọn thể loại hoặc quốc gia khác nhé.
                  </p>
                </div>
              )}

            <div
              className={`mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 transition-all duration-300 ${
                discoverVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              {discoverMovies.map((m) => (
                <DiscoverMovieCard
                  key={m.id}
                  item={m}
                  onClick={() => navigate(`/movie/${m.id}`)}
                />
              ))}
            </div>

            {discoverTotalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-300">
                <button
                  type="button"
                  onClick={() => handleDiscoverChangePage(1)}
                  disabled={discoverPage === 1 || discoverLoading}
                  className="rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-1.5 font-medium transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  « First
                </button>
                <button
                  type="button"
                  onClick={() => handleDiscoverChangePage(discoverPage - 1)}
                  disabled={discoverPage === 1 || discoverLoading}
                  className="rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-1.5 font-medium transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ‹ Prev
                </button>

                {discoverPageNumbers.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleDiscoverChangePage(p)}
                    className={`h-8 w-8 rounded-full text-xs font-semibold transition-all ${
                      p === discoverPage
                        ? "bg-linear-to-tr from-red-500 via-amber-400 to-yellow-300 text-black shadow-md shadow-red-600/50"
                        : "border border-neutral-700 bg-neutral-950/80 text-neutral-300 hover:border-amber-400 hover:text-amber-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleDiscoverChangePage(discoverPage + 1)}
                  disabled={
                    discoverPage === discoverTotalPages || discoverLoading
                  }
                  className="rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-1.5 font-medium transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next ›
                </button>
                <button
                  type="button"
                  onClick={() => handleDiscoverChangePage(discoverTotalPages)}
                  disabled={
                    discoverPage === discoverTotalPages || discoverLoading
                  }
                  className="rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-1.5 font-medium transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Last »
                </button>

                <span className="ml-2 text-[11px] text-neutral-500">
                  Page{" "}
                  <span className="font-semibold text-amber-300">
                    {discoverPage}
                  </span>{" "}
                  / {discoverTotalPages}
                </span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SearchAdvancedPage;

// ================== DISCOVER MOVIE CARD ==================
interface DiscoverMovieCardProps {
  item: TMDBSearchMovieItem;
  onClick?: () => void;
}

function DiscoverMovieCard({ item, onClick }: DiscoverMovieCardProps) {
  const title = item.title || item.original_title;
  const date = item.release_date || "Unknown";
  const vote = item.vote_average?.toFixed(1);
  const poster = item.poster_path ?? item.backdrop_path;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/85 shadow transition-all hover:-translate-y-1.5 hover:border-amber-400/80 hover:shadow-2xl hover:shadow-red-700/40"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden">
        {poster ? (
          <img
            src={`${IMAGE_BASE}/w342${poster}`}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-400">
            No image
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/90 to-transparent" />
        {vote && (
          <div className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-semibold text-amber-300 shadow shadow-black/80">
            ★ {vote}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 text-left">
        <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-amber-300">
          {title}
        </h3>
        <p className="text-[11px] text-neutral-400">{date}</p>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-neutral-400">
          {item.genre_ids?.slice(0, 2).map((gid) => (
            <span
              key={gid}
              className="rounded-full border border-red-600/60 bg-red-900/40 px-2 py-0.5 text-[10px]"
            >
              #{gid}
            </span>
          ))}
          {item.vote_count > 0 && (
            <span className="ml-auto rounded-full border border-neutral-700 bg-neutral-900/80 px-2 py-0.5 text-[10px]">
              {item.vote_count.toLocaleString()} votes
            </span>
          )}
        </div>
      </div>
    </button>
  );
}