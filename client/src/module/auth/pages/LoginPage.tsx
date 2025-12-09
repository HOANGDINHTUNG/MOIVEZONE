// src/auth/features/pages/LoginPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/UseCustomeRedux";
import { getAllUsers } from "../../../api/server/User.api";
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

      // lưu token (id user)
      try {
        localStorage.setItem("token", JSON.stringify(matched.id));
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
      dispatch(login(matched));

      // init account config cho accountSlice
      if (matched.apiKey && matched.sessionId && matched.accountId) {
        dispatch(
          initAccountConfig({
            apiKey: matched.apiKey,
            sessionId: matched.sessionId,
            accountId: matched.accountId,
          })
        );
      }

      setAlert({
        type: "success",
        message: "Đăng nhập thành công! Đang chuyển hướng...",
      });

      setTimeout(() => navigate("/"), 800);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alert */}
      {alert && (
        <div
          className={`rounded-xl border px-3 py-2.5 text-xs sm:text-sm ${
            alert.type === "error"
              ? "border-red-500/70 bg-red-950/70 text-red-200"
              : "border-emerald-500/70 bg-emerald-950/70 text-emerald-200"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-200">
          Email
        </label>
        <input
          type="email"
          className="w-full rounded-xl border border-red-900/50 bg-black/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-red-500 focus:bg-black/80 focus:ring-2 focus:ring-red-700/70"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-200">
          Mật khẩu
        </label>
        <input
          type="password"
          className="w-full rounded-xl border border-red-900/50 bg-black/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-red-500 focus:bg-black/80 focus:ring-2 focus:ring-red-700/70"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
            className="h-3.5 w-3.5 rounded border border-red-700/70 bg-black/60 text-red-500 focus:ring-red-700"
          />
          <span>Ghi nhớ email</span>
        </label>
        <span className="cursor-not-allowed text-slate-600">
          Quên mật khẩu?
        </span>
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
          className="font-medium text-red-400 hover:text-red-300"
        >
          Đăng ký ngay
        </Link>
      </div>
    </form>
  );
};

export default LoginPage;
