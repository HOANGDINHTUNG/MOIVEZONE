// src/components/footer/Footer.tsx
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaGithub,
  FaYoutube,
  FaTiktok,
  FaChevronUp,
} from "react-icons/fa";

import logo from "../../../public/assets/img/logo3.png"; // chỉnh lại path nếu khác

const Footer = () => {
  const smoothScrollToTop = () => {
    const start = window.pageYOffset;
    const duration = 600; // ms
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, start * (1 - ease));

      if (elapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <footer
      className="
        w-full mt-14 border-t
        border-neutral-200 dark:border-neutral-800
        bg-neutral-50/95 dark:bg-linear-to-t dark:from-black dark:via-neutral-950 dark:to-neutral-900
        text-neutral-700 dark:text-neutral-300
      "
    >
      {/* Thêm class animate-fade-up để chạy animation */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12 animate-fade-up">
        {/* TOP: logo + slogan + back to top */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MovieZone"
              className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(236,173,41,0.7)]"
            />
            <div>
              <h2 className="text-lg font-semibold tracking-wide text-neutral-900 dark:text-neutral-100">
                MovieZone
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Dive into the universe of movies &amp; TV shows.
              </p>
            </div>
          </div>

          <button
            onClick={smoothScrollToTop}
            className="
              inline-flex items-center gap-2
              rounded-full
              border border-neutral-300 dark:border-yellow-500/40
              bg-white/90 dark:bg-neutral-900/80
              px-4 py-2
              text-xs font-medium uppercase tracking-wide
              text-neutral-800 dark:text-neutral-200
              shadow-sm dark:shadow-[0_0_10px_rgba(255,204,0,0.25)]
              transition-all duration-300
              hover:border-yellow-500
              hover:text-yellow-600
              hover:shadow-md
              dark:hover:border-yellow-400
              dark:hover:text-yellow-300
              dark:hover:bg-neutral-900
              dark:hover:shadow-[0_0_18px_rgba(255,204,0,0.5)]
            "
          >
            <FaChevronUp className="text-[10px]" />
            Back to top
          </button>
        </div>

        {/* GRID: 4 cột */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm">
          {/* ABOUT */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              About
            </h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link
                  to="/"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  About MovieZone
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Explore movies
                </Link>
              </li>
              <li>
                <Link
                  to="/tv"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Explore TV shows
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Support
            </h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link
                  to="/help"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Help center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Send feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Social
            </h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Legal
            </h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link
                  to="/terms"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Terms of use
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  Cookie policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM: icons + copyright */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <div className="flex items-center gap-4 text-lg text-neutral-500 dark:text-neutral-400">
            <a
              href="#"
              className="hover:text-yellow-600 dark:hover:text-yellow-400 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="hover:text-yellow-600 dark:hover:text-yellow-400 transition"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="hover:text-yellow-600 dark:hover:text-yellow-400 transition"
            >
              <FaTiktok />
            </a>
            <a
              href="#"
              className="hover:text-yellow-600 dark:hover:text-yellow-400 transition"
            >
              <FaGithub />
            </a>
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-500 text-center md:text-right">
            © {new Date().getFullYear()} MovieZone. Created by Dynamic Coding
            with Amit (refactor TS). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
