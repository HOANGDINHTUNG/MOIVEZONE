import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import {
  fetchCertifications,
  clearCertifications,
} from "../store/certificationSlice";
import CertificationCountrySection from "../components/CertificationCountrySection";
import type { TMDBCertificationItem } from "../database/interface/certification";

type MediaKind = "movie" | "tv";

const CertificationPage = () => {
  const dispatch = useAppDispatch();
  const { movie, tv, loading, error } = useAppSelector(
    (state) => state.certifications
  );

  const [activeKind, setActiveKind] = useState<MediaKind>("movie");
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [searchCountry, setSearchCountry] = useState("");

  useEffect(() => {
    dispatch(fetchCertifications());

    return () => {
      dispatch(clearCertifications());
    };
  }, [dispatch]);

  const activeData = activeKind === "movie" ? movie : tv;

  const countries = useMemo(() => {
    if (!activeData) return [];
    return Object.keys(activeData.certifications).sort();
  }, [activeData]);

  const filteredCountries = useMemo(() => {
    if (!searchCountry.trim()) return countries;
    const q = searchCountry.trim().toLowerCase();
    return countries.filter((c) => c.toLowerCase().includes(q));
  }, [countries, searchCountry]);

  // ✅ Không setState trong effect nữa, chỉ dẫn xuất giá trị
  const effectiveCountry = useMemo(() => {
    if (activeCountry && countries.includes(activeCountry)) {
      return activeCountry;
    }
    if (countries.length > 0) {
      return countries[0];
    }
    return null;
  }, [activeCountry, countries]);

  const activeItems: TMDBCertificationItem[] = useMemo(() => {
    if (!activeData || !effectiveCountry) return [];
    return activeData.certifications[effectiveCountry] ?? [];
  }, [activeData, effectiveCountry]);

  return (
    <div
      className="
        min-h-screen
        px-4 md:px-8 py-4 md:py-6 space-y-6
        bg-neutral-100 dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-100
        transition-colors
      "
    >
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold">
          Content Ratings (Certifications)
        </h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl">
          Tổng hợp các nhãn phân loại độ tuổi cho{" "}
          <span className="font-semibold">phim điện ảnh (Movie)</span> và{" "}
          <span className="font-semibold">chương trình TV</span> theo từng quốc
          gia. Nhấp vào quốc gia để xem chi tiết từng rating và ý nghĩa của nó.
        </p>
      </header>

      {/* Tabs Movie / TV */}
      <div className="inline-flex rounded-full bg-neutral-200 dark:bg-neutral-800 p-1 text-xs md:text-sm">
        <button
          type="button"
          onClick={() => setActiveKind("movie")}
          className={`
            px-3 md:px-4 py-1.5 rounded-full font-medium
            transition
            ${
              activeKind === "movie"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm"
                : "text-neutral-600 dark:text-neutral-300"
            }
          `}
        >
          Movie Certifications
        </button>
        <button
          type="button"
          onClick={() => setActiveKind("tv")}
          className={`
            px-3 md:px-4 py-1.5 rounded-full font-medium
            transition
            ${
              activeKind === "tv"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm"
                : "text-neutral-600 dark:text-neutral-300"
            }
          `}
        >
          TV Certifications
        </button>
      </div>

      {/* Loading / Error */}
      {loading && !activeData && (
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          Đang tải danh sách chứng nhận...
        </div>
      )}

      {error && !activeData && (
        <div className="text-sm text-red-500 dark:text-red-400">
          Có lỗi khi tải dữ liệu: {error}
        </div>
      )}

      {activeData && (
        <div className="space-y-4">
          {/* Bộ lọc quốc gia */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mr-2">
                Countries:
              </span>

              <div className="flex flex-wrap gap-2">
                {filteredCountries.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setActiveCountry(code)}
                    className={`
                      px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
                      border transition
                      ${
                        effectiveCountry === code
                          ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
                          : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }
                    `}
                  >
                    {code}
                  </button>
                ))}

                {filteredCountries.length === 0 && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Không tìm thấy quốc gia phù hợp.
                  </span>
                )}
              </div>
            </div>

            {/* Ô search country code */}
            <div className="w-full md:w-64">
              <input
                type="text"
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                placeholder="Lọc theo mã quốc gia (VD: US, GB, VN)..."
                className="
                  w-full px-3 py-1.5 text-xs rounded-full
                  bg-white dark:bg-neutral-900
                  border border-neutral-300 dark:border-neutral-700
                  text-neutral-800 dark:text-neutral-100
                  placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                  outline-none focus:ring-2 focus:ring-red-500/60
                "
              />
            </div>
          </div>

          {/* Nội dung chính */}
          {effectiveCountry && activeItems.length > 0 ? (
            <CertificationCountrySection
              countryCode={effectiveCountry}
              items={activeItems}
            />
          ) : (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Chọn một quốc gia để xem các certification chi tiết.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationPage;
