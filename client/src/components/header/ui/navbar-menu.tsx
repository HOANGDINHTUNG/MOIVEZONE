// src/components/header/ui/navbar-menu.tsx
"use client";

import React from "react";
import { motion, type Transition } from "motion/react";
import { Link, useLocation } from "react-router-dom";

// Transition dùng chung cho dropdown
const springTransition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

type MenuItemProps = {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;              // label hiển thị
  to: string;                // route chính để click + active
  children?: React.ReactNode;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  setActive,
  active,
  item,
  to,
  children,
}) => {
  const location = useLocation();

  // trang hiện tại có khớp với "to" hay không
  const isPageActive =
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  const isDropdownOpen = active === item;

  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      {/* Label chính + gạch vàng active */}
      <Link to={to}>
        <motion.div
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center"
        >
          <span
            className={`cursor-pointer text-[13px] uppercase tracking-wide transition-colors ${
              isPageActive
                ? "text-white font-semibold"
                : "text-white/80 hover:text-white"
            }`}
          >
            {item}
          </span>

          {/* Gạch active giống NavLink cũ */}
          {isPageActive && (
            <span className="mt-1 block h-[3px] w-15 rounded-full bg-[#ecad29]" />
          )}
        </motion.div>
      </Link>

      {/* Dropdown */}
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          transition={springTransition}
        >
          <div className="absolute top-[105%] left-1/2 -translate-x-1/2 pt-1 z-50">
            <motion.div
              layoutId="active-menu-dropdown" // giúp animate mượt giữa các menu
              transition={springTransition}
              className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/20 dark:border-white/20 shadow-xl"
            >
              <motion.div layout className="w-max h-full p-4">
                {children}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

type MenuProps = {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
};

export const Menu: React.FC<MenuProps> = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative flex items-center gap-6"
    >
      {children}
    </nav>
  );
};

type ProductItemProps = {
  title: string;
  description: string;
  href: string;
  src: string;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  href,
  src,
}) => {
  return (
    <a href={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-40 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

type HoveredLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

export const HoveredLink: React.FC<HoveredLinkProps> = ({
  children,
  ...rest
}) => {
  return (
    <a
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-red-700"
    >
      {children}
    </a>
  );
};
