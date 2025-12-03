import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import { fetchTvCategories } from "../store/tvCategorySlice";
import type { TMDBTvSummary } from "../database/interface/tvList";
import TvCard from "../components/TvCard";

type TvTabKey = "airing_today" | "on_the_air" | "popular" | "top_rated";

const TABS: { key: TvTabKey; label: string; description: string }[] = [
  {
    key: "airing_today",
    label: "Airing Today",
    description: "Những tập mới phát sóng trong hôm nay.",
  },
  {
    key: "on_the_air",
    label: "On The Air",
    description: "Series đang lên sóng, cập nhật liên tục.",
  },
  {
    key: "popular",
    label: "Popular",
    description: "TV show được xem nhiều và bàn tán nhiều nhất.",
  },
  {
    key: "top_rated",
    label: "Top Rated",
    description:
      "Điểm số cao, nội dung chất lượng – fan ruột không thể bỏ qua.",
  },
];

export default function TvCategoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { type } = useParams<{ type: TvTabKey }>();
  const activeTab: TvTabKey =
    type && TABS.some((t) => t.key === type) ? type : "airing_today";

  const { airingToday, onTheAir, popular, topRated, loading, error } =
    useAppSelector((state) => state.tvCategories);

  useEffect(() => {
    dispatch(fetchTvCategories());
  }, [dispatch]);

  const currentList: TMDBTvSummary[] = useMemo(() => {
    switch (activeTab) {
      case "airing_today":
        return airingToday;
      case "on_the_air":
        return onTheAir;
      case "popular":
        return popular;
      case "top_rated":
        return topRated;
      default:
        return [];
    }
  }, [activeTab, airingToday, onTheAir, popular, topRated]);

  const currentTabMeta = TABS.find((t) => t.key === activeTab)!;

  const goToTab = (key: TvTabKey) => {
    navigate(`/category_tv/${key}`);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-950 via-black to-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:pt-10">
        {/* header */}
        <header className="mb-6 space-y-4 md:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-300 ring-1 ring-indigo-400/40">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
            TV Explorer
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
            Discover TV Shows by Category
          </h1>
          <p className="max-w-2xl text-sm text-neutral-400 md:text-base">
            Duyệt qua TV show đang phát sóng, on-air, phổ biến và được đánh giá
            cao – tất cả trong một layout hiện đại, rõ ràng.
          </p>

          {/* tabs */}
          <div className="mt-4 inline-flex gap-2 rounded-full bg-neutral-900/80 p-1 ring-1 ring-neutral-800">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => goToTab(tab.key)}
                  className={[
                    "relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all md:px-4 md:text-sm",
                    isActive
                      ? "bg-indigo-400 text-black shadow-lg"
                      : "text-neutral-300 hover:bg-neutral-800/80",
                  ].join(" ")}
                >
                  {isActive && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-indigo-400/40 blur-md" />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* trạng thái */}
        {loading && (
          <div className="flex justify-center pb-10">
            <div className="flex items-center gap-3 rounded-full bg-neutral-900/80 px-4 py-2 text-sm text-neutral-300 ring-1 ring-neutral-800">
              <span className="h-2 w-2 animate-ping rounded-full bg-indigo-400" />
              Đang tải TV shows...
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {/* grid */}
        {!loading && !error && (
          <>
            <section className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-50 md:text-xl">
                  <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]" />
                  {currentTabMeta.label}
                </h2>
                <p className="mt-1 text-xs text-neutral-400 md:text-sm">
                  {currentTabMeta.description}
                </p>
              </div>
              <div className="text-xs text-neutral-400 md:text-sm">
                {currentList.length} TV shows found
              </div>
            </section>

            <section>
              {currentList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-center text-sm text-neutral-400">
                  Không có TV show nào.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {currentList.map((tv) => (
                    <TvCard key={tv.id} tv={tv} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
