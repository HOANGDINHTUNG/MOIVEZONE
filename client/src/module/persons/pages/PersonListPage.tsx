import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tmdbPersonApi } from "../../../api/movie/TMDBPerson.api";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import type {
  TMDBPersonSummary,
  TMDBPopularPersonsResponse,
} from "../database/interface/person";
import PersonCard from "../components/PersonCard";

const PersonListPage = () => {
  const language = useAppSelector((state) => state.language.current);

  const [searchParams, setSearchParams] = useSearchParams();

  // lấy giá trị ban đầu từ URL: /people?q=...&dept=...
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [departmentFilter, setDepartmentFilter] = useState<string>(
    () => searchParams.get("dept") ?? "all"
  );

  const [people, setPeople] = useState<TMDBPersonSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data: TMDBPopularPersonsResponse = await tmdbPersonApi.getPopular(
          currentPage,
          language
        );
        if (isCancelled) return;

        setPeople(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error(err);
        if (!isCancelled) {
          setError("Không tải được danh sách người từ TMDB.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [currentPage, language]);

  // update URL query khi search / filter đổi
  const updateUrlParams = (nextSearch: string, nextDept: string) => {
    const params: Record<string, string> = {};
    if (nextSearch.trim()) params.q = nextSearch.trim();
    if (nextDept !== "all") params.dept = nextDept;
    setSearchParams(params);
  };

  const handleSearchInputChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // về trang 1 khi đổi search
    updateUrlParams(value, departmentFilter);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setCurrentPage(1); // về trang 1 khi đổi bộ phận
    updateUrlParams(search, value);
  };

  // Filter list theo search + department
  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      const matchName = search
        ? p.name.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchDept =
        departmentFilter === "all"
          ? true
          : p.known_for_department.toLowerCase() ===
            departmentFilter.toLowerCase();

      return matchName && matchDept;
    });
  }, [people, search, departmentFilter]);

  const departmentOptions: { value: string; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "Acting", label: "Acting" },
    { value: "Directing", label: "Directing" },
    { value: "Writing", label: "Writing" },
    { value: "Production", label: "Production" },
  ];

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  // Tạo danh sách số trang nhỏ gọn
  const paginationNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-50">
      {/* HERO SECTION */}
      <section className="border-b border-gray-200 bg-white dark:border-neutral-900 dark:bg-linear-to-b dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-20 md:flex-row md:items-center md:pb-14 md:pt-24">
          <div className="md:w-3/5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 dark:bg-amber-400" />
              Discover People
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
              Bảng xếp hạng{" "}
              <span className="bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent dark:from-amber-300 dark:via-orange-400 dark:to-yellow-300">
                gương mặt điện ảnh
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-gray-600 dark:text-neutral-300 md:text-base">
              Khám phá những diễn viên, đạo diễn, biên kịch nổi bật trên TMDB.
              Lọc theo bộ phận, tìm tên yêu thích và xem chi tiết hành trình sự
              nghiệp của họ.
            </p>

            {/* Search + filter */}
            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:w-2/3">
                <input
                  type="text"
                  placeholder="Tìm theo tên person..."
                  value={search}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/60 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:shadow-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearchInputChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 md:w-1/3 md:justify-end">
                {departmentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleDepartmentChange(opt.value)}
                    className={`rounded-full px-3 py-1 text-[11px] transition-colors ${
                      departmentFilter === opt.value
                        ? "bg-amber-400 text-amber-950"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Info dòng dưới */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-neutral-400">
              <span>
                Trang{" "}
                <span className="text-gray-900 dark:text-neutral-100">
                  {currentPage.toLocaleString()}
                </span>{" "}
                /{" "}
                <span className="text-gray-900 dark:text-neutral-100">
                  {totalPages.toLocaleString()}
                </span>
              </span>
              {filteredPeople.length !== people.length && (
                <span>
                  Đang lọc{" "}
                  <span className="text-gray-900 dark:text-neutral-100">
                    {filteredPeople.length}
                  </span>{" "}
                  / {people.length} person trên trang này
                </span>
              )}
            </div>
          </div>

          {/* Hero mini panel */}
          <div className="md:w-2/5">
            <div className="rounded-2xl border border-gray-200 bg-white/50 p-4 shadow-xl backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-black/40">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                Gợi ý
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-neutral-200">
                Nhấn vào một person để xem chi tiết bio, danh sách phim đã tham
                gia, hình ảnh và lịch sử cập nhật trên TMDB.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-gray-500 dark:text-neutral-300">
                <li>• Dùng ô tìm kiếm để lọc nhanh theo tên.</li>
                <li>
                  • Dùng chip Acting / Directing / Writing để lọc theo bộ phận.
                </li>
                <li>• Dùng phân trang bên dưới để xem thêm person.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LIST SECTION */}
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        {/* Loading / error */}
        {loading && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300">
            Đang tải danh sách person...
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/80 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Grid person */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight md:text-2xl">
              Popular People
            </h2>
            <span className="text-xs text-gray-500 dark:text-neutral-400">
              Hiển thị {filteredPeople.length} / {people.length} trên trang này
            </span>
          </div>

          {filteredPeople.length ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredPeople.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Không tìm thấy person nào phù hợp với bộ lọc hiện tại.
            </p>
          )}
        </section>

        {/* Pagination */}
        <section className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-neutral-900 dark:text-neutral-300 md:flex-row">
          <div>
            Trang{" "}
            <span className="text-gray-900 dark:text-neutral-50">
              {currentPage.toLocaleString()}
            </span>{" "}
            /{" "}
            <span className="text-gray-900 dark:text-neutral-50">
              {totalPages.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!canPrev}
              className={`rounded-full px-3 py-1 ${
                canPrev
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-neutral-900/50 dark:text-neutral-600"
              }`}
            >
              ← Prev
            </button>

            {paginationNumbers[0] > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => handlePageChange(1)}
                  className="rounded-full bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  1
                </button>
                {paginationNumbers[0] > 2 && (
                  <span className="px-1 text-gray-400 dark:text-neutral-500">
                    ...
                  </span>
                )}
              </>
            )}

            {paginationNumbers.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`rounded-full px-3 py-1 ${
                  page === currentPage
                    ? "bg-amber-400 text-amber-950"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {page}
              </button>
            ))}

            {paginationNumbers[paginationNumbers.length - 1] < totalPages && (
              <>
                {paginationNumbers[paginationNumbers.length - 1] <
                  totalPages - 1 && (
                  <span className="px-1 text-gray-400 dark:text-neutral-500">
                    ...
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handlePageChange(totalPages)}
                  className="rounded-full bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!canNext}
              className={`rounded-full px-3 py-1 ${
                canNext
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-neutral-900/50 dark:text-neutral-600"
              }`}
            >
              Next →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PersonListPage;
