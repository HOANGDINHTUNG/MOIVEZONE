// src/NotFoundPage.tsx
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-lg text-slate-400">
        Ôi, trang bạn tìm không tồn tại rồi…
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="rounded-full border border-red-500 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
        >
          Về trang chủ
        </Link>
        <Link
          to="/login"
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Đến trang đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
