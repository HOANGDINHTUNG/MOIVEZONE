// src/components/header/Header.tsx
import { NavLink, Link, useNavigate } from "react-router-dom";

import DarkModeToggle from "../common/ui/DarkModeToggle";
import LanguageToggle from "../common/ux/LanguageToggle";

import logo from "../../../public/assets/img/logo3.png";
import { useAppDispatch, useAppSelector } from "../../hooks/UseCustomeRedux";
import { logout } from "../../module/auth/store/authSlice";

// import HeaderSearch from "./components/HeaderSearch";
import UserMenu from "./components/UserMenu";
import NeonHeaderSearch from "./components/NeonHeaderSearch";

interface HeaderProps {
  admin?: boolean;
}

const navLinkBase =
  "relative text-[13px] md:text-[14px] uppercase tracking-wide cursor-pointer transition-colors";

const activeUnderline =
  "after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[3px] after:rounded-full after:bg-[#ecad29]";

export default function Header({ admin }: HeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, currentUser } = useAppSelector(
    (state) => state.auth
  );

  const displayName =
    currentUser?.username ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "User");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // header cho trang admin
  if (admin) {
    return (
      <header className="sticky top-0 z-80 bg-neutral-950/90 text-neutral-50 border-b border-neutral-800 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-8 rounded-lg object-contain"
            />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Admin Panel
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <DarkModeToggle />
          </div>
        </div>
      </header>
    );
  }

  // header chính
  return (
    <header className="sticky top-0 z-80 bg-neutral-950/70 text-white backdrop-blur border-b border-neutral-800">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-8 py-4">
        {/* Logo + tên site */}
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-black/60 border border-white/10 grid place-items-center">
            <img
              src={logo}
              alt="Cinema"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.18em]">
              Galaxy Cinema
            </span>
            <span className="text-[11px] text-white/60">
              Movies • TV • Showtimes
            </span>
          </div>
        </Link>

        {/* Nav links giữa */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkBase} ${
                isActive ? activeUnderline : "text-white/80 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `${navLinkBase} ${
                isActive ? activeUnderline : "text-white/80 hover:text-white"
              }`
            }
          >
            Explore
          </NavLink>

          <NavLink
            to="/movie"
            className={({ isActive }) =>
              `${navLinkBase} ${
                isActive ? activeUnderline : "text-white/80 hover:text-white"
              }`
            }
          >
            Movies
          </NavLink>

          <NavLink
            to="/tv"
            className={({ isActive }) =>
              `${navLinkBase} ${
                isActive ? activeUnderline : "text-white/80 hover:text-white"
              }`
            }
          >
            TV Shows
          </NavLink>

          <NavLink
            to="/search?s="
            className={({ isActive }) =>
              `${navLinkBase} ${
                isActive ? activeUnderline : "text-white/80 hover:text-white"
              }`
            }
          >
            Search
          </NavLink>
        </div>

        {/* Search nhỏ + toggles + auth */}
        <div className="flex items-center gap-3">
          {/* Search compact cho desktop (đã tách component + icon search) */}
          {/* <HeaderSearch /> */}

          <div className="hidden md:block">
            <NeonHeaderSearch />
          </div>

          {/* Nếu CHƯA đăng nhập: toggle + login */}
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <LanguageToggle />
              <DarkModeToggle />
              <Link
                to="/login"
                className="inline-flex items-center rounded-full border border-[#ecad29]/60 px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide text-[#ecad29] hover:bg-[#ecad29] hover:text-black transition-colors"
              >
                Login
              </Link>
            </div>
          ) : (
            // ĐÃ ĐĂNG NHẬP: dùng UserMenu
            <UserMenu
              displayName={displayName}
              email={currentUser?.email}
              onLogout={handleLogout}
            />
          )}
        </div>
      </nav>

      {/* Nav mobile đơn giản */}
      <div className="md:hidden px-4 pb-3 flex items-center justify-between text-[12px] uppercase tracking-wide text-white/80">
        <div className="flex items-center gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `mr-2 ${isActive ? "text-white font-semibold" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `mr-2 ${isActive ? "text-white font-semibold" : ""}`
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/movie"
            className={({ isActive }) =>
              `mr-2 ${isActive ? "text-white font-semibold" : ""}`
            }
          >
            Movies
          </NavLink>
          <NavLink
            to="/tv"
            className={({ isActive }) =>
              `${isActive ? "text-white font-semibold" : ""}`
            }
          >
            TV
          </NavLink>
        </div>

        {/* Auth mobile */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-white/80">
                Login
              </Link>
              <Link to="/register" className="text-[#ecad29]">
                Reg
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="text-white">
                {displayName}
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-400 font-semibold"
              >
                Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
