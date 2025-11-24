// src/contants/navigation.tsx
import type { ReactNode } from "react";
import { MdHomeFilled } from "react-icons/md";
import { PiTelevisionFill } from "react-icons/pi";
import { BiSolidMoviePlay } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export const navigation: NavItem[] = [
  {
    label: "TV Shows",
    href: "tv",
    icon: <PiTelevisionFill />,
  },
  {
    label: "Movies",
    href: "movie",
    icon: <BiSolidMoviePlay />,
  },
];

export const mobileNavigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <MdHomeFilled />,
  },
  ...navigation.map((n) => ({
    ...n,
    href: `/${n.href}`,
  })),
  {
    label: "search",
    href: "/search",
    icon: <IoSearchOutline />,
  },
];
