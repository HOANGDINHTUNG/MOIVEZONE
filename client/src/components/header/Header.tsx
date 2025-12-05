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
import { BiLogIn, BiUserPlus } from "react-icons/bi";

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

      // nhỏ hơn 2px thì bỏ qua cho đỡ rung
      const DEADZONE = 2;

      // Kéo xuống (scroll down) -> ẩn header
      if (diff > DEADZONE) {
        setShowHeader(false);
      }
      // Kéo lên (scroll up) -> hiện header
      else if (diff < -DEADZONE) {
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

  // ===== HEADER ADMIN (GIỮ NGUYÊN, KHÔNG CẦN HIỆU ỨNG SCROLL) =====
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

            {/* MOVIES – có hình */}
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

            {/* EXPLORE */}
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
                  <HoveredLink href="/movie?sort=popular">
                    List favorites
                  </HoveredLink>
                  <HoveredLink href="/movie?sort=popular">History</HoveredLink>
                </div>
              </div>
            </MenuItem>

            {/* SEARCH */}
            {/* <MenuItem
              setActive={setActiveMenu}
              active={activeMenu}
              item="Search"
              to="/search"
            >
              <div className="flex flex-col space-y-3 text-sm p-1 pr-3">
                <p className="text-[11px] uppercase tracking-wide text-neutral-400">
                  Search tips
                </p>
                <ul className="list-disc list-inside space-y-1 text-[12px] text-neutral-200">
                  <li>Tìm theo tên phim, TV show hoặc diễn viên.</li>
                  <li>Dùng tiếng Anh để có nhiều kết quả hơn.</li>
                  <li>Kết hợp filters trong trang Search để lọc kỹ hơn.</li>
                </ul>
                <HoveredLink href="/search?s=">
                  Đi tới trang Search &rarr;
                </HoveredLink>
              </div>
            </MenuItem> */}
          </Menu>
        </div>

        {/* Search nhỏ + toggles + auth */}
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

      {/* Nav mobile */}
      <nav className="md:hidden px-3 py-2 bg-neutral-950/80 border-b border-neutral-800 backdrop-blur">
        {/* HÀNG 1: LOGO + NAV (THẲNG HÀNG) */}
        <div className="flex items-center justify-around gap-3">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center">
            <div className="w-9 h-9 overflow-hidden grid place-items-center ">
              <img
                src={logo}
                alt="Cinema"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>

          {/* Navigation pill */}
          <div className="flex items-center overflow-x-auto scrollbar-none">
            <div className="inline-flex items-center gap-2 px-2 py-1">
              {/* HOME */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  [
                    "p-1.5 text-[11px] rounded-full uppercase tracking-wide whitespace-nowrap transition-all duration-200",
                    isActive
                      ? "bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 text-black font-semibold shadow-md shadow-yellow-500/30"
                      : "text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20",
                  ].join(" ")
                }
              >
                Home
              </NavLink>

              {/* EXPLORE */}
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  [
                    "p-1.5 text-[11px] rounded-full uppercase tracking-wide whitespace-nowrap transition-all duration-200",
                    isActive
                      ? "bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 text-black font-semibold shadow-md shadow-yellow-500/30"
                      : "text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20",
                  ].join(" ")
                }
              >
                Explore
              </NavLink>

              {/* MOVIES */}
              <NavLink
                to="/movie"
                className={({ isActive }) =>
                  [
                    "p-1.5 text-[11px] rounded-full uppercase tracking-wide whitespace-nowrap transition-all duration-200",
                    isActive
                      ? "bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 text-black font-semibold shadow-md shadow-yellow-500/30"
                      : "text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20",
                  ].join(" ")
                }
              >
                Movies
              </NavLink>

              {/* TV */}
              <NavLink
                to="/tv"
                className={({ isActive }) =>
                  [
                    "p-1.5 text-[11px] rounded-full uppercase tracking-wide whitespace-nowrap transition-all duration-200",
                    isActive
                      ? "bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 text-black font-semibold shadow-md shadow-yellow-500/30"
                      : "text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20",
                  ].join(" ")
                }
              >
                TV
              </NavLink>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-[12px] text-white/80 uppercase tracking-wide"
                >
                  <BiLogIn />
                </Link>

                <Link
                  to="/register"
                  className="px-1.5 py-1.5 rounded-full border border-[#ecad29]/70 
          text-[#ecad29] text-[12px] font-semibold uppercase tracking-wide 
          shadow-sm shadow-[#ecad29]/20"
                >
                  <BiUserPlus />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="text-white text-[7px] font-medium"
                >
                  {displayName}
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-[7px] font-semibold uppercase tracking-wide text-red-400"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
