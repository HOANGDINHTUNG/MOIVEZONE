// src/components/header/Header.tsx
import { NavLink, Link } from "react-router-dom";

import DarkModeToggle from "../common/ui/DarkModeToggle";
import LanguageToggle from "../common/ux/LanguageToggle";

import logo from "../../../public/assets/img/logo3.png";

interface HeaderProps {
  admin?: boolean;
}

const navLinkBase =
  "relative text-[13px] md:text-[14px] uppercase tracking-wide cursor-pointer transition-colors";

const activeUnderline =
  "after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[3px] after:rounded-full after:bg-[#ecad29]";

export default function Header({ admin }: HeaderProps) {
  // header cho trang admin: gọn, tối, vẫn dùng dark mode + language
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

  // header chính: style giống navbar trong TimedCardsHero
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
              `${navLinkBase} ${isActive ? activeUnderline : "text-white/80 hover:text-white"}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeUnderline : "text-white/80 hover:text-white"}`
            }
          >
            Explore
          </NavLink>

          <NavLink
            to="/movies"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeUnderline : "text-white/80 hover:text-white"}`
            }
          >
            Movies
          </NavLink>

          <NavLink
            to="/tv"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeUnderline : "text-white/80 hover:text-white"}`
            }
          >
            TV Shows
          </NavLink>

          <NavLink
            to="/search?s="
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeUnderline : "text-white/80 hover:text-white"}`
            }
          >
            Search
          </NavLink>
        </div>

        {/* Search nhỏ + toggles + auth */}
        <div className="flex items-center gap-3">
          {/* Search compact cho desktop */}
          <form
            action="/search"
            className="hidden md:flex items-center rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[13px]"
          >
            <input
              type="text"
              name="s"
              placeholder="Search movie..."
              className="bg-transparent outline-none placeholder:text-white/40 text-white w-32"
            />
            <button type="submit" className="ml-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white/70"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </form>

          <LanguageToggle />
          <DarkModeToggle />

          {/* Placeholder nút Login (có thể nối với auth slice sau) */}
          <button className="hidden sm:inline-flex items-center rounded-full border border-[#ecad29]/60 px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide text-[#ecad29] hover:bg-[#ecad29] hover:text-black transition-colors">
            Login
          </button>
        </div>
      </nav>

      {/* Nav mobile đơn giản */}
      <div className="md:hidden px-4 pb-3 flex items-center gap-4 text-[12px] uppercase tracking-wide text-white/80">
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
          to="/movies"
          className={({ isActive }) =>
            `mr-2 ${isActive ? "text-white font-semibold" : ""}`
          }
        >
          Movies
        </NavLink>
        <NavLink
          to="/tv-shows"
          className={({ isActive }) =>
            `${isActive ? "text-white font-semibold" : ""}`
          }
        >
          TV
        </NavLink>
      </div>
    </header>
  );
}
