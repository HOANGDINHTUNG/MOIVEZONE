import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAppDispatch } from "../../../hooks/UseCustomeRedux";
import { getAllUsers, updateUserDirect } from "../../../api/server/User.api";
import type { IUser } from "../database/interface/users";
import { login } from "../store/authSlice";
import { initAccountConfig } from "../../accounts/store/accountSlice";

type AlertState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  // đọc remembered email
  useEffect(() => {
    try {
      const remembered = localStorage.getItem("moviezone_remember_email");
      if (remembered) {
        const parsed = JSON.parse(remembered) as string;
        setEmail(parsed);
        setRememberEmail(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!email.trim() || !password.trim()) {
      setAlert({
        type: "error",
        message: "Vui lòng nhập đầy đủ email và mật khẩu.",
      });
      return;
    }

    setLoading(true);
    try {
      const users = await getAllUsers();

      const matched: IUser | undefined = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (!matched) {
        setAlert({
          type: "error",
          message: "Email hoặc mật khẩu không đúng.",
        });
        setLoading(false);
        return;
      }

      // normalize role/status (tương thích dữ liệu cũ)
      const normalizedRole: IUser["role"] =
        matched.role ??
        (matched.email.trim().toLowerCase() === "admin@moviezone.com" ||
        matched.username.trim().toLowerCase() === "admin"
          ? "admin"
          : "user");

      const normalizedStatus: IUser["status"] = matched.status ?? "active";

      // Nếu bị block thì không cho đăng nhập
      if (normalizedStatus === "blocked") {
        setAlert({
          type: "error",
          message:
            "Tài khoản của bạn đã bị chặn. Vui lòng liên hệ quản trị viên.",
        });
        setLoading(false);
        return;
      }

      const normalizedUser: IUser = {
        ...matched,
        role: normalizedRole,
        status: normalizedStatus,
      };

      // patch nhẹ nếu db cũ chưa có role/status
      if (!matched.role || !matched.status) {
        try {
          await updateUserDirect({
            id: matched.id,
            role: normalizedRole,
            status: normalizedStatus,
          });
        } catch {
          // ignore
        }
      }

      // lưu token (id user)
      try {
        localStorage.setItem("token", JSON.stringify(normalizedUser.id));
      } catch {
        // ignore
      }

      // ghi nhớ email nếu cần
      try {
        if (rememberEmail) {
          localStorage.setItem(
            "moviezone_remember_email",
            JSON.stringify(email.trim())
          );
        } else {
          localStorage.removeItem("moviezone_remember_email");
        }
      } catch {
        // ignore
      }

      // login vào Redux auth
      dispatch(login(normalizedUser));

      // init account config cho accountSlice
      if (
        normalizedUser.apiKey &&
        normalizedUser.sessionId &&
        normalizedUser.accountId
      ) {
        dispatch(
          initAccountConfig({
            apiKey: normalizedUser.apiKey,
            sessionId: normalizedUser.sessionId,
            accountId: normalizedUser.accountId,
          })
        );
      }

      setAlert({
        type: "success",
        message: "Đăng nhập thành công! Đang chuyển hướng...",
      });

      setTimeout(() => {
        if (normalizedRole === "admin") navigate("/admin");
        else navigate("/");
      }, 800);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      {/* Alert */}
      {alert && (
        <div
          className={`rounded-xl border px-3 py-2.5 text-xs sm:text-sm ${
            alert.type === "error"
              ? "border-rose-500/70 bg-rose-950/60 text-rose-200"
              : "border-emerald-500/70 bg-emerald-950/60 text-emerald-200"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-200">Email</label>
        <input
          type="email"
          className="w-full rounded-xl border border-red-900/50 bg-black/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-rose-400 focus:bg-black/80 focus:ring-2 focus:ring-rose-600/60"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      {/* Password + Eye */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-200">
          Mật khẩu
        </label>

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            className="w-full rounded-xl border border-red-900/50 bg-black/60 px-3 py-2 pr-11 text-sm text-slate-50 outline-none transition focus:border-rose-400 focus:bg-black/80 focus:ring-2 focus:ring-rose-600/60"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-rose-200/95 hover:bg-white/5 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
            aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            aria-pressed={showPass}
          >
            {showPass ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
            className="h-3.5 w-3.5 rounded border border-rose-700/70 bg-black/60 text-rose-500 focus:ring-rose-600"
          />
          <span>Ghi nhớ email</span>
        </label>
        <span className="cursor-not-allowed text-slate-600">Quên mật khẩu?</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex w-full items-center justify-center rounded-xl bg-linear-to-r from-red-600 via-rose-600 to-red-500 px-4 py-2.5 text-sm font-medium text-slate-50 shadow-[0_12px_40px_rgba(220,38,38,0.65)] transition hover:from-red-500 hover:via-rose-500 hover:to-red-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      {/* Line */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <span className="h-px w-10 bg-slate-700" />
        <span>hoặc</span>
        <span className="h-px w-10 bg-slate-700" />
      </div>

      {/* Link sang Register */}
      <div className="text-center text-xs text-slate-400">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="font-medium text-rose-300 hover:text-amber-200"
        >
          Đăng ký ngay
        </Link>
      </div>
    </form>
  );
};

export default LoginPage;
