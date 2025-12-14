import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/UseCustomeRedux";
import { selectAdminState } from "../module/admin/store/adminSlice";

const ProtectedRoute = () => {
  const { currentUser, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const { blockedUsers } = useAppSelector(selectAdminState);

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Nếu user bị đánh dấu blocked trực tiếp trên tài khoản
  if (currentUser.status === "blocked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md rounded-3xl border border-red-600/70 bg-linear-to-br from-slate-950 via-slate-900 to-black p-6 text-center shadow-[0_0_90px_-40px_rgba(248,113,113,0.9)]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <span className="text-xl">!</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-50">
            Tài khoản của bạn đã bị chặn
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Vui lòng liên hệ quản trị viên để biết thêm chi tiết.
          </p>
        </div>
      </div>
    );
  }

  const isBlocked = blockedUsers.some((u) => u.id === String(currentUser.id));

  if (isBlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md rounded-3xl border border-red-600/70 bg-linear-to-br from-slate-950 via-slate-900 to-black p-6 text-center shadow-[0_0_90px_-40px_rgba(248,113,113,0.9)]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <span className="text-xl">!</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-50">
            Tài khoản của bạn đã bị chặn
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Vui lòng liên hệ quản trị viên để biết thêm chi tiết.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
