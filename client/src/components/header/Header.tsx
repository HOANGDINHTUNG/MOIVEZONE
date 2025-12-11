"use client";

import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import DarkModeToggle from "../common/ui/DarkModeToggle";
import LanguageToggle from "../common/ux/LanguageToggle";

import logo from "../../../public/assets/img/logo3.png";
import { useAppDispatch, useAppSelector } from "../../hooks/UseCustomeRedux";
import { logout } from "../../module/auth/store/authSlice";

import UserMenu from "./components/UserMenu";
import NeonHeaderSearch from "./components/NeonHeaderSearch";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { BiLogIn, BiLogOut, BiUserPlus, BiX } from "react-icons/bi";

interface HeaderProps {
  admin?: boolean;
}

export default function Header({ admin }: HeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, currentUser } = useAppSelector(
    (state) => state.auth
  );

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // ====== LOGIC ẨN / HIỆN HEADER THEO SCROLL ======
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;

      // Ở top: luôn hiện header
      if (currentY <= 0) {
        setShowHeader(true);
        lastScrollY.current = 0;
        return;
      }

      const diff = currentY - lastScrollY.current;

      const DEADZONE = 2;

      if (diff > DEADZONE) {
        // kéo xuống
        setShowHeader(false);
      } else if (diff < -DEADZONE) {
        // kéo lên
        setShowHeader(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName =
    currentUser?.username ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "User");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ====== STATE MENU MOBILE SLIDE-IN ======
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const openMobileMenu = () => setMobileMenuOpen(true);

  // ===== HEADER ADMIN (GIỮ NGUYÊN) =====
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

  // ===== HEADER CHÍNH =====
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-80 border-b border-neutral-800 bg-neutral-950/70 text-white backdrop-blur transition-transform duration-300 ease-out will-change-transform ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Nav desktop */}
        <nav className="mx-auto hidden md:flex max-w-6xl items-center justify-between px-3 sm:px-4 md:px-8 py-2.5 gap-2">
          {/* Logo + tên site */}
          <Link to="/" className="hidden md:flex items-center gap-2">
            <div className="md:w-12 md:h-12 overflow-hidden grid place-items-center">
              <img
                src={logo}
                alt="Cinema"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.18em]">
                Galaxy Cinema
              </span>
              <span className="text-[10px] sm:text-[11px] text-white/60">
                Movies • TV • Showtimes
              </span>
            </div>
          </Link>

          {/* Nav giữa – dùng Menu animate + active underline */}
          <div className="hidden md:flex items-center">
            <Menu setActive={setActiveMenu}>
              {/* HOME */}
              <MenuItem
                setActive={setActiveMenu}
                active={activeMenu}
                item="Home"
                to="/"
              >
                <div className="flex flex-col space-y-3 text-sm">
                  <HoveredLink href="/">Trang chủ</HoveredLink>
                  <HoveredLink href="/search?s=">Tìm kiếm nhanh</HoveredLink>
                </div>
              </MenuItem>

              {/* MOVIES */}
              <MenuItem
                setActive={setActiveMenu}
                active={activeMenu}
                item="Movies"
                to="/movie"
              >
                <div className="text-sm grid grid-cols-2 gap-6 p-2">
                  <ProductItem
                    title="Popular Movies"
                    href="/category_movie/popular"
                    src="https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
                    description="Danh sách phim đang hot, đang được xem nhiều."
                  />
                  <ProductItem
                    title="Top Rated"
                    href="/category_movie/top_rated"
                    src="https://image.tmdb.org/t/p/w300/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg"
                    description="Những bộ phim được đánh giá cao nhất."
                  />
                  <ProductItem
                    title="Upcoming"
                    href="/category_movie/upcoming"
                    src="https://image.tmdb.org/t/p/w300/1E5baAaEse26fej7uHcjOgEE2t2.jpg"
                    description="Phim sắp chiếu, đừng bỏ lỡ suất chiếu đầu tiên."
                  />
                  <ProductItem
                    title="Now Playing"
                    href="/category_movie/now_playing"
                    src="https://image.tmdb.org/t/p/w300/b9ixaRHHhkdeMfUn3xOcHWY5IXI.jpg"
                    description="Phim đang chiếu ngoài rạp tuần này."
                  />
                </div>
              </MenuItem>

              {/* TV SHOWS */}
              <MenuItem
                setActive={setActiveMenu}
                active={activeMenu}
                item="TV Shows"
                to="/tv"
              >
                <div className="text-sm grid grid-cols-2 gap-6 p-2">
                  <ProductItem
                    title="Popular TV"
                    href="/category_tv/popular"
                    src="https://image.tmdb.org/t/p/w300/oHx043lHsysn8klll1nPvKMBHLf.jpg"
                    description="Series được xem nhiều nhất hiện tại."
                  />
                  <ProductItem
                    title="Top Rated TV"
                    href="/category_tv/top_rated"
                    src="https://image.tmdb.org/t/p/w300/roYyPiQDQKmIKUEhO912693tSja.jpg"
                    description="Những series được chấm điểm cao nhất."
                  />
                  <ProductItem
                    title="On The Air"
                    href="/category_tv/on_the_air"
                    src="https://image.tmdb.org/t/p/w300/ogyw5LTmL53dVxsppcy8Dlm30Fu.jpg"
                    description="Đang phát sóng từng tuần, cập nhật liên tục."
                  />
                  <ProductItem
                    title="Airing Today"
                    href="/category_tv/airing_today"
                    src="https://image.tmdb.org/t/p/w300/2IWouZK4gkgHhJa3oyYuSWfSqbG.jpg"
                    description="Tập mới lên sóng trong ngày hôm nay."
                  />
                </div>
              </MenuItem>

              {/* MORE */}
              <MenuItem
                setActive={setActiveMenu}
                active={activeMenu}
                item="More"
                to="/explore"
              >
                <div className="grid grid-cols-2 gap-4 text-sm p-1 pr-3">
                  <div className="flex flex-col space-y-2">
                    <p className="text-[11px] uppercase tracking-wide text-neutral-400">
                      EXPLORE
                    </p>
                    <HoveredLink href="/explore">All</HoveredLink>
                    <HoveredLink href="/trending">Trending</HoveredLink>
                    <HoveredLink href="/search_advanced">
                      Advanced search
                    </HoveredLink>
                    <HoveredLink href="/person">Person</HoveredLink>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-[11px] uppercase tracking-wide text-neutral-400">
                      PERSONAL
                    </p>
                    <HoveredLink href="/account">
                      List favorites
                    </HoveredLink>
                    <HoveredLink href="/movie?sort=popular">
                      History
                    </HoveredLink>
                    <HoveredLink href="/event">
                      Event
                    </HoveredLink>
                  </div>
                </div>
              </MenuItem>
            </Menu>
          </div>

          {/* Search + toggles + auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <NeonHeaderSearch />
            </div>

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
              <UserMenu
                displayName={displayName}
                email={currentUser?.email}
                onLogout={handleLogout}
              />
            )}
          </div>
        </nav>

        {/* Nav mobile (thanh trên + nút mở menu) */}
        <nav className="md:hidden px-3 py-2 bg-neutral-950/80 border-b border-neutral-800 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            {/* Logo: bấm để mở menu trượt trái */}
            <button
              type="button"
              onClick={openMobileMenu}
              className="inline-flex items-center gap-2 focus:outline-none"
            >
              <div className="w-14 h-9 overflow-hidden grid place-items-center rounded-md bg-black/40">
                <img
                  src={logo}
                  alt="Cinema"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Galaxy
                </span>
                <span className="text-[9px] text-white/60">Tap để mở menu</span>
              </div>
            </button>

            {/* Search nhỏ + auth icon */}
            <div className="flex items-center gap-3">
              {/* Có thể thêm icon search sau */}
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-[19px] text-white/80"
                    aria-label="Login"
                  >
                    <BiLogIn />
                  </Link>

                  <Link
                    to="/register"
                    className="px-1.5 py-1.5 rounded-full border border-[#ecad29]/70 
                            text-[#ecad29] text-[15px] font-semibold uppercase tracking-wide 
                            shadow-sm shadow-[#ecad29]/20"
                  >
                    <BiUserPlus />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="text-white text-[12px] font-medium max-w-20 truncate"
                  >
                    {displayName}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-[19px] font-semibold uppercase tracking-wide text-red-400"
                  >
                    <BiLogOut />
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ===== MOBILE SLIDE MENU ===== */}
      {/* Overlay tối */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-79 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Panel trượt từ trái */}
      <div
        className={`fixed inset-y-0 left-0 z-80 w-[78%] max-w-xs bg-neutral-950/95 border-r border-neutral-800 shadow-xl md:hidden transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header panel */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-neutral-800">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 overflow-hidden grid place-items-center rounded-md bg-black/40">
              <img
                src={logo}
                alt="Cinema"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Galaxy Cinema
              </span>
              <span className="text-[10px] text-white/60">
                Movies • TV • Showtimes
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="p-1 rounded-full bg-white/5 hover:bg-white/10"
            aria-label="Close menu"
          >
            <BiX className="text-lg" />
          </button>
        </div>

        {/* Nội dung menu */}
        <div className="px-4 py-3 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          {/* SEARCH */}
          <div className="mb-2 flex items-center justify-center">
            <NeonHeaderSearch />
          </div>

          {/* LINKS CHÍNH */}
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wide text-neutral-400">
              Navigation
            </p>
            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                [
                  "block rounded-md px-3 py-2 text-[13px] font-medium tracking-wide",
                  isActive
                    ? "bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 text-black shadow-md shadow-yellow-500/30"
                    : "bg-white/5 text-neutral-100 hover:bg-white/10",
                ].join(" ")
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/explore"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                [
                  "block rounded-md px-3 py-2 text-[13px] font-medium tracking-wide",
                  isActive
                    ? "bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 text-black shadow-md shadow-yellow-500/30"
                    : "bg-white/5 text-neutral-100 hover:bg-white/10",
                ].join(" ")
              }
            >
              Explore
            </NavLink>

            <NavLink
              to="/movie"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                [
                  "block rounded-md px-3 py-2 text-[13px] font-medium tracking-wide",
                  isActive
                    ? "bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 text-black shadow-md shadow-yellow-500/30"
                    : "bg-white/5 text-neutral-100 hover:bg-white/10",
                ].join(" ")
              }
            >
              Movies
            </NavLink>

            <NavLink
              to="/tv"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                [
                  "block rounded-md px-3 py-2 text-[13px] font-medium tracking-wide",
                  isActive
                    ? "bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 text-black shadow-md shadow-yellow-500/30"
                    : "bg-white/5 text-neutral-100 hover:bg-white/10",
                ].join(" ")
              }
            >
              TV Shows
            </NavLink>
          </div>

          {/* NHÓM DISCOVERY */}
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-neutral-400">
              Discover
            </p>
            <NavLink
              to="/trending"
              onClick={closeMobileMenu}
              className="block text-[12px] text-neutral-200 px-2 py-1 rounded hover:bg-white/5"
            >
              Trending
            </NavLink>
            <NavLink
              to="/search_advanced"
              onClick={closeMobileMenu}
              className="block text-[12px] text-neutral-200 px-2 py-1 rounded hover:bg-white/5"
            >
              Advanced search
            </NavLink>
            <NavLink
              to="/person"
              onClick={closeMobileMenu}
              className="block text-[12px] text-neutral-200 px-2 py-1 rounded hover:bg-white/5"
            >
              Person
            </NavLink>
          </div>

          {/* TOGGLE + AUTH */}
          <div className="pt-2 border-t border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-neutral-300">Language</span>
              <LanguageToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-neutral-300">Dark mode</span>
              <DarkModeToggle />
            </div>

            {!isAuthenticated ? (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex-1 inline-flex items-center justify-center rounded-full border border-[#ecad29]/70 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#ecad29] hover:bg-[#ecad29] hover:text-black transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-[#ecad29] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-black shadow-sm shadow-[#ecad29]/40"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col">
                  <span className="text-[11px] text-neutral-400">
                    Signed in
                  </span>
                  <span className="text-[12px] text-neutral-100">
                    {displayName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="text-[11px] font-semibold uppercase tracking-wide text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
