// src/components/header/UserMenu.tsx
import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "../../common/ui/DarkModeToggle";
import LanguageToggle from "../../common/ux/LanguageToggle";
import { StyledWrapper } from "../ui/Btn";

type UserMenuProps = {
  displayName: string;
  email?: string | null;
  onLogout: () => void;
};

const UserMenu: React.FC<UserMenuProps> = ({
  displayName,
  email,
  onLogout,
}) => {
  return (
    <div className="hidden sm:flex items-center">
      <div className="relative group">
        {/* Nút user (avatar + tên + caret) */}

        <button
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-2.5 py-1.5 text-[13px] hover:bg-white/10 transition-colors"
          type="button"
        >
          <div className="h-7 w-7 rounded-full bg-[#ecad29]/90 text-[13px] font-semibold grid place-items-center text-black">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="max-w-[90px] truncate text-xs font-medium">
            {displayName}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-white/70"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        <div
          className="
            absolute right-0 mt-2 w-60
            rounded-xl border border-neutral-700
            bg-neutral-950/95
            shadow-xl backdrop-blur-lg
            p-3
            hidden group-hover:block
          "
        >
          {/* Info user */}
          <div className="pb-3 mb-3 border-b border-neutral-800">
            <p className="text-xs text-neutral-400">Signed in as</p>
            <p className="text-sm font-semibold text-neutral-100 truncate">
              {displayName}
            </p>
            {email && (
              <p className="text-[11px] text-neutral-500 truncate">{email}</p>
            )}
            <Link
              to="/profile"
              className="mt-2 inline-block text-[11px] text-[#ecad29] hover:text-yellow-400"
            >
              View profile
            </Link>
          </div>

          {/* Tùy chỉnh theme + ngôn ngữ */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-neutral-400">Appearance</span>
              <DarkModeToggle />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-neutral-400">Language</span>
              <LanguageToggle />
            </div>
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-neutral-800">
            <StyledWrapper>
              <button className="Btn w-full" onClick={onLogout}>
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                  </svg>
                </div>
                <div className="text">Logout</div>
              </button>
            </StyledWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
