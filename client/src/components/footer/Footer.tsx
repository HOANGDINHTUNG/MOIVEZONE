// src/components/footer/Footer.tsx
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaGithub,
  FaYoutube,
  FaTiktok,
  FaChevronUp,
} from "react-icons/fa";
import logo from "../../../public/assets/img/logo3.png";

const Footer = () => {
  const smoothScrollToTop = () => {
    const start = window.pageYOffset;
    const duration = 600;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, start * (1 - ease));
      if (elapsed < duration) requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <footer
      className="
        w-full mt-10 sm:mt-14 border-t
        border-neutral-200 dark:border-neutral-800
        bg-neutral-50/95 dark:bg-linear-to-t dark:from-black dark:via-neutral-950 dark:to-neutral-900
        text-neutral-700 dark:text-neutral-300
      "
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* TOP */}
        <div className="py-8 sm:py-10 md:py-12 animate-fade-up">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="MovieZone"
                className="h-9 sm:h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(236,173,41,0.7)]"
              />
              <div className="leading-tight">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold tracking-wide text-neutral-900 dark:text-neutral-100">
                    MovieZone
                  </h2>
                  <button
                    onClick={smoothScrollToTop}
                    className="
                      md:hidden inline-flex items-center justify-center gap-2
                      self-start md:self-auto
                      rounded-full
                      border border-neutral-300 dark:border-yellow-500/40
                      bg-white/90 dark:bg-neutral-900/80
                      px-2 py-1 sm:px-4
                      text-[9px] sm:text-xs font-semibold uppercase tracking-wide
                      text-neutral-800 dark:text-neutral-200
                      shadow-sm dark:shadow-[0_0_10px_rgba(255,204,0,0.25)]
                      transition-all duration-300
                      hover:border-yellow-500 hover:text-yellow-600 hover:shadow-md
                      dark:hover:border-yellow-400 dark:hover:text-yellow-300
                      dark:hover:bg-neutral-900 dark:hover:shadow-[0_0_18px_rgba(255,204,0,0.5)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60
                    "
                    aria-label="Back to top"
                  >
                    <FaChevronUp className="text-[9px] sm:text-xs" />
                    <span className="hidden xs:inline">Back to top</span>
                    <span className="xs:hidden">Top</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  Dive into the universe of movies &amp; TV shows.
                </p>
              </div>
            </div>

            {/* Back to top */}
            <button
              onClick={smoothScrollToTop}
              className="
                hidden md:inline-flex items-center justify-center gap-2
                self-start md:self-auto
                rounded-full
                border border-neutral-300 dark:border-yellow-500/40
                bg-white/90 dark:bg-neutral-900/80
                px-3 py-2 sm:px-4
                text-[11px] sm:text-xs font-semibold uppercase tracking-wide
                text-neutral-800 dark:text-neutral-200
                shadow-sm dark:shadow-[0_0_10px_rgba(255,204,0,0.25)]
                transition-all duration-300
                hover:border-yellow-500 hover:text-yellow-600 hover:shadow-md
                dark:hover:border-yellow-400 dark:hover:text-yellow-300
                dark:hover:bg-neutral-900 dark:hover:shadow-[0_0_18px_rgba(255,204,0,0.5)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60
              "
              aria-label="Back to top"
            >
              <FaChevronUp className="text-[10px] sm:text-xs" />
              <span className="xs:inline">Back to top</span>
            </button>
          </div>

          {/* GRID LINKS */}
          <div className="mt-10 grid gap-8 sm:gap-10">
            <div
              className="
                grid grid-cols-2 gap-8
                sm:grid-cols-3
                lg:grid-cols-4
              "
            >
              {/* ABOUT */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  About
                </h3>
                <ul className="space-y-2 text-[13px] sm:text-sm">
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
                <ul className="space-y-2 text-[13px] sm:text-sm">
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
                <ul className="space-y-2 text-[13px] sm:text-sm">
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
                <ul className="space-y-2 text-[13px] sm:text-sm">
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
          </div>

          {/* BOTTOM */}
          <div className="mt-5 md:mt-10 border-t border-neutral-200 dark:border-neutral-800 pt-2 md:pt-5 mb-8 md:mb-0">
            <div className="flex flex-col gap-2 md:gap-5 md:flex-row md:items-center md:justify-between">
              {/* Icons */}
              <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 text-lg sm:text-xl text-neutral-500 dark:text-neutral-400">
                <a
                  href="#"
                  className="p-2 rounded-full hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  aria-label="TikTok"
                >
                  <FaTiktok />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
              </div>

              {/* Copyright */}
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-500 text-center md:text-right leading-relaxed">
                © {new Date().getFullYear()} MovieZone. Created by Dynamic
                Coding with Amit (refactor TS). All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
