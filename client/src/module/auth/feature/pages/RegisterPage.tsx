// src/auth/features/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser, getAllUsers } from "../../../../api/server/User.api";
import { generateMovieZoneCredentials } from "../utils/generateMovieZoneCredentials";

type AlertState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!email.trim() || !username.trim() || !password.trim()) {
      setAlert({
        type: "error",
        message: "Vui lòng nhập đầy đủ email, username và mật khẩu.",
      });
      return;
    }

    if (password.length < 8) {
      setAlert({
        type: "error",
        message: "Mật khẩu phải có ít nhất 8 ký tự.",
      });
      return;
    }

    setLoading(true);

    try {
      const users = await getAllUsers();
      const existed = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (existed) {
        setAlert({
          type: "error",
          message: "Email này đã được đăng ký.",
        });
        setLoading(false);
        return;
      }

      const creds = generateMovieZoneCredentials();

      await createUser({
        email: email.trim(),
        username: username.trim(),
        password, // TODO: thực tế nên hash
        apiKey: creds.apiKey,
        sessionId: creds.sessionId,
        accountId: creds.accountId,
      });

      setAlert({
        type: "success",
        message: "Đăng ký thành công! Đang chuyển đến trang đăng nhập...",
      });

      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.",
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

      {/* Username */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-200">
          Username
        </label>
        <input
          type="text"
          className="w-full rounded-xl border border-red-900/50 bg-black/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-red-500 focus:bg-black/80 focus:ring-2 focus:ring-red-700/70"
          placeholder="movie_fan_123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
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
          autoComplete="new-password"
        />
        <p className="text-[11px] text-slate-500">
          Tối thiểu 8 ký tự. Nên dùng chữ hoa, chữ thường, số hoặc ký tự đặc
          biệt để bảo mật hơn.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex w-full items-center justify-center rounded-xl bg-linear-to-r from-red-600 via-rose-600 to-red-500 px-4 py-2.5 text-sm font-medium text-slate-50 shadow-[0_12px_40px_rgba(220,38,38,0.65)] transition hover:from-red-500 hover:via-rose-500 hover:to-red-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
      >
        {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
      </button>

      {/* Line */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <span className="h-px w-10 bg-slate-700" />
        <span>hoặc</span>
        <span className="h-px w-10 bg-slate-700" />
      </div>

      {/* Link sang Login */}
      <div className="text-center text-xs text-slate-400">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="font-medium text-red-400 hover:text-red-300"
        >
          Đăng nhập
        </Link>
      </div>
    </form>
  );
};

export default RegisterPage;
