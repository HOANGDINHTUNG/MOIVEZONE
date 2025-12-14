import type { JSX } from "react";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import {
  moveSectionDown,
  moveSectionUp,
  selectAdminState,
  setSectionVisibility,
  toggleFeature,
} from "../store/adminSlice";
import AdminFeatureToggleRow from "../components/AdminFeatureToggleRow";
import AdminSectionRow from "../components/AdminSectionRow";
import AdminActivityItem from "../components/AdminActivityItem";
import AdminStatsCharts from "../components/AdminStatsCharts";
import AdminRestrictedContentPanel from "../components/AdminRestrictedContentPanel";

const AdminDashboardPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { features, sections, activity } = useAppSelector(selectAdminState);

  const totalEnabledFeatures = useMemo(
    () => features.filter((f) => f.value).length,
    [features]
  );
  const totalSectionsVisible = useMemo(
    () => sections.filter((s) => s.visible).length,
    [sections]
  );
  const latestActivities = useMemo(() => activity.slice(0, 10), [activity]);

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col px-4 pb-16 pt-24 md:px-6 lg:px-10">
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-amber-400">
              Admin · MovieZone Control
            </p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl lg:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Quản lý xuất hiện các section có lịch sử, bật/tắt tính năng người
              dùng, và theo dõi mọi thay đổi trong hệ thống.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
              {totalEnabledFeatures} features đang bật
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
              {totalSectionsVisible}/{sections.length} sections đang hiển thị
            </span>
          </div>
        </header>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_0_70px_-40px_rgba(248,250,252,0.8)]">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
              Features
            </p>
            <p className="mt-2 text-2xl font-semibold text-amber-300">
              {totalEnabledFeatures}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Tính năng đang được kích hoạt cho người dùng.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
              Sections
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {totalSectionsVisible}/{sections.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Section đang hiển thị trên trang Home.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
              Activity
            </p>
            <p className="mt-2 text-2xl font-semibold text-sky-300">
              {activity.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Bản ghi lịch sử thay đổi được lưu lại.
            </p>
          </div>
        </section>

        {/* ANALYTICS / CHARTS */}
        <section className="mt-8">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
                Analytics tổng quan
              </h2>
              <p className="mt-1 text-xs text-slate-500 max-w-xl">
                Biểu đồ trực quan về hoạt động quản trị, nội dung và mức độ sử
                dụng tính năng. Dữ liệu hiện tại là demo – bạn có thể nối API
                thật sau.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <AdminStatsCharts />
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* FEATURE TOGGLES */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
                    Feature Toggles
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Bật/tắt nhanh các tính năng ảnh hưởng đến trải nghiệm người
                    dùng.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {features
                  .filter((f) => f.group === "Homepage")
                  .map((f) => (
                    <AdminFeatureToggleRow
                      key={f.key}
                      feature={f}
                      onToggle={() => dispatch(toggleFeature(f.key))}
                    />
                  ))}

                <div className="mt-3 border-t border-slate-800 pt-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  User Features
                </div>

                {features
                  .filter((f) => f.group === "User")
                  .map((f) => (
                    <AdminFeatureToggleRow
                      key={f.key}
                      feature={f}
                      onToggle={() => dispatch(toggleFeature(f.key))}
                    />
                  ))}

                <div className="mt-3 border-t border-slate-800 pt-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Content Features
                </div>

                {features
                  .filter((f) => f.group === "Content")
                  .map((f) => (
                    <AdminFeatureToggleRow
                      key={f.key}
                      feature={f}
                      onToggle={() => dispatch(toggleFeature(f.key))}
                    />
                  ))}
              </div>
            </div>

            {/* SECTION VISIBILITY & ORDER */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
                    Quản lý Section Home
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Chọn section nào được hiển thị trên trang chủ và sắp xếp thứ
                    tự của chúng.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {sortedSections.map((section, index) => (
                  <AdminSectionRow
                    key={section.id}
                    section={section}
                    isFirst={index === 0}
                    isLast={index === sortedSections.length - 1}
                    onToggleVisible={() =>
                      dispatch(
                        setSectionVisibility({
                          id: section.id,
                          visible: !section.visible,
                        })
                      )
                    }
                    onMoveUp={() => dispatch(moveSectionUp(section.id))}
                    onMoveDown={() => dispatch(moveSectionDown(section.id))}
                  />
                ))}
              </div>
            </div>

            {/* RESTRICTED CONTENT */}
            <AdminRestrictedContentPanel />
          </div>

          {/* RIGHT COLUMN – ACTIVITY & QUICK INFO */}
          <div className="space-y-6">
            {/* ACTIVITY LOG */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
                    Lịch sử thay đổi
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Log ghi lại toàn bộ thao tác bật/tắt feature và thay đổi
                    layout của bạn.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {latestActivities.length === 0 && (
                  <p className="text-xs text-slate-500">
                    Chưa có hoạt động nào được ghi lại.
                  </p>
                )}
                {latestActivities.map((item) => (
                  <AdminActivityItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* HINT / QUICK HELP */}
            <div className="rounded-3xl border border-amber-600/60 bg-linear-to-br from-slate-900 via-slate-950 to-black p-4 md:p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-300">
                Hướng dẫn kết nối với UI
              </h2>
              <p className="mt-2 text-xs text-amber-50/90">
                Để các toggle ở đây thực sự điều khiển UI, bạn chỉ cần đọc state
                <span className="font-mono text-[11px] text-amber-200">
                  {" "}
                  admin
                </span>{" "}
                trong các component như{" "}
                <span className="font-mono text-[11px]">
                  HomePage
                </span> hoặc{" "}
                <span className="font-mono text-[11px]">BannerHome</span> và
                ẩn/hiện section tương ứng.
              </p>
              <p className="mt-2 text-[11px] text-amber-100/80">
                Ví dụ: ẩn BannerHome khi{" "}
                <span className="font-mono text-[11px]">
                  showHomeBanner = false
                </span>
                , hoặc không render section lịch sử nếu{" "}
                <span className="font-mono text-[11px]">
                  showHistoryChangesSection = false
                </span>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
