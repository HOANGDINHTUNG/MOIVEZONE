// src/module/auth/feature/layout/AuthLayout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { VideoText } from "../ui/video-text";

type AuthLayoutProps = {
  videoSrc?: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ videoSrc }) => {
  const location = useLocation();

  const isRegister = location.pathname.toLowerCase().includes("register");
  const mode: "login" | "register" = isRegister ? "register" : "login";

  const title =
    mode === "login"
      ? "Chào mừng trở lại, MovieZone"
      : "Tạo tài khoản, MovieZone";

  const subtitle =
    mode === "login"
      ? "Đăng nhập để tiếp tục khám phá kho phim của riêng bạn."
      : "Trở thành thành viên, lưu lại mọi bộ phim bạn yêu thích.";

  const displayTitle = title.replace(", ", "\n");

  const fallbackVideo = "https://res.cloudinary.com/dmzvum1lp/video/upload/v1764555606/2715412-uhd_3840_2160_30fps_wpl7ra.mp4"

  // Dùng chung 1 video cho cả background và VideoText
  const effectiveVideo = videoSrc || fallbackVideo;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#02010A] text-slate-50">
      {/* Background gradient đỏ đen */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#7f1d1d_0,#02010a_45%,#000000_100%)]" />

      {/* Vệt sáng */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-72 w-72 rotate-[-25deg] bg-linear-to-r from-red-700/60 via-red-500/0 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rotate-18 bg-linear-to-l from-rose-600/55 via-red-500/0 to-transparent blur-3xl" />

      {/* Card auth */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-red-900/40 bg-black/60 shadow-[0_24px_90px_rgba(0,0,0,0.95)] backdrop-blur-xl md:flex-row">
          {/* Video Section - Đổi order dựa vào mode */}
          <aside
            className={[
              "relative hidden w-full max-w-sm overflow-hidden border-red-900/40 md:flex",
              "transition-all duration-700 ease-out",
              isRegister
                ? "order-last border-l brightness-110"
                : "order-first border-r brightness-100",
            ].join(" ")}
          >
            {/* Video nền */}
            <video
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={effectiveVideo} />
            </video>

            {/* Overlay nhẹ để chữ rõ hơn */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/60" />

            {/* Nội dung trên video */}
            <div className="relative z-10 flex h-full flex-col justify-between px-8 py-8">
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-red-500 via-rose-500 to-amber-400 text-lg font-bold text-black shadow-lg shadow-red-900/50">
                    MZ
                  </div>
                  <span className="text-lg font-semibold tracking-wide text-slate-50">
                    MovieZone
                  </span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl font-semibold leading-tight text-slate-50">
                    Đắm chìm trong
                    <br />
                    <span className="bg-linear-to-r from-red-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                      thế giới điện ảnh
                    </span>
                  </h1>
                  <p className="text-sm text-slate-200/85">
                    Đăng nhập để lưu lại phim yêu thích, danh sách chờ xem và
                    đánh giá của riêng bạn – như một chiếc vé thành viên VIP ở
                    rạp MovieZone.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-xs text-slate-300">
                <p className="font-medium uppercase tracking-[0.2em] text-red-300/90">
                  MOVIEZONE CINEMA EXPERIENCE
                </p>
                <p>
                  Từ bom tấn Hollywood đến phim bộ đình đám, tất cả đều nằm
                  trong một tài khoản duy nhất của bạn.
                </p>
              </div>
            </div>
          </aside>

          {/* Form Section - Đổi order dựa vào mode */}
          <main
            className={[
              "flex-1 px-5 py-6 sm:px-8 sm:py-8",
              "transition-all duration-700 ease-out",
              isRegister ? "order-first" : "order-last",
            ].join(" ")}
          >
            <div className="mx-auto flex w-full max-w-md flex-col gap-6">
              <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400/90">
                  {mode === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
                </p>
                <h2 className="relative h-[150px] w-full overflow-hidden">
                  <VideoText src={fallbackVideo} className="block">
                    {displayTitle}
                  </VideoText>
                </h2>
                <p className="text-sm text-slate-400">{subtitle}</p>
              </header>

              {/* Form login / register (từ <Outlet />) */}
              <section>
                <Outlet />
              </section>

              <footer className="mt-4 flex flex-col items-center gap-2 text-xs text-slate-500 sm:flex-row sm:justify-between">
                <span>© {new Date().getFullYear()} MovieZone</span>
                <div className="flex gap-2 text-[11px]">
                  <span>Rạp phim ảo của riêng bạn</span>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
