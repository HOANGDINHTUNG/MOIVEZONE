import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  mode: "login" | "register";
};

const AuthLayout = ({ children, title, subtitle, mode }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#02010A] text-slate-50">
      {/* Background gradient đỏ đen */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#7f1d1d_0,#02010a_45%,#000000_100%)]" />

      {/* Vệt sáng kiểu projector */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-72 w-72 rotate-[-25deg] bg-linear-to-r from-red-700/60 via-red-500/0 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rotate-18 bg-linear-to-l from-rose-600/55 via-red-500/0 to-transparent blur-3xl" />

      {/* Nội dung chính */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-red-900/40 bg-black/60 shadow-[0_24px_90px_rgba(0,0,0,0.95)] backdrop-blur-xl md:flex-row">
          {/* Cột trái: branding rạp phim */}
          <aside className="relative hidden w-full max-w-sm flex-col justify-between border-r border-red-900/40 bg-linear-to-b from-black/80 via-[#111827]/90 to-black/95 px-8 py-8 md:flex">
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
                  <span className="bg-linear-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                    thế giới điện ảnh
                  </span>
                </h1>
                <p className="text-sm text-slate-300/80">
                  Đăng nhập để lưu lại phim yêu thích, danh sách chờ xem và đánh
                  giá của riêng bạn – như một chiếc vé thành viên VIP ở rạp
                  MovieZone.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-xs text-slate-400">
              <p className="font-medium uppercase tracking-[0.2em] text-red-400/80">
                MOVIEZONE CINEMA EXPERIENCE
              </p>
              <p>
                Từ bom tấn Hollywood đến phim bộ đình đám, tất cả đều nằm trong
                một tài khoản duy nhất của bạn.
              </p>
            </div>
          </aside>

          {/* Cột phải: form */}
          <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-md flex-col gap-6">
              <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400/90">
                  {mode === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
                </p>
                <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                  {title}
                </h2>
                <p className="text-sm text-slate-400">{subtitle}</p>
              </header>

              <section>{children}</section>

              <footer className="mt-4 flex flex-col items-center gap-2 text-xs text-slate-500 sm:flex-row sm:justify-between">
                <span>© {new Date().getFullYear()} MovieZone</span>
                <div className="flex gap-2 text-[11px]">
                  <span>Rạp phim ảo của riêng bạn</span>
                </div>
              </footer>

              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-500">
                {mode === "login" ? (
                  <>
                    <span>Chưa có tài khoản?</span>
                    <Link
                      to="/register"
                      className="font-medium text-red-400 hover:text-red-300"
                    >
                      Đăng ký ngay
                    </Link>
                  </>
                ) : (
                  <>
                    <span>Đã có tài khoản?</span>
                    <Link
                      to="/login"
                      className="font-medium text-red-400 hover:text-red-300"
                    >
                      Đăng nhập
                    </Link>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
