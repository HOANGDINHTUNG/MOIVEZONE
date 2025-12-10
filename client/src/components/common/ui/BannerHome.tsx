// src/components/common/ui/BannerHome.tsx
import { useMemo, useRef, useLayoutEffect, type FC } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import type {
  TMDBMovieImagesResponse,
  TMDBMovieSummary,
} from "../../../module/movies/database/interface/movie";
import { TMDB_IMAGE } from "../../../module/movies/pages/DetailsPage";

interface BannerHomeProps {
  data?: TMDBMovieSummary[];
}

// Movie dùng cho Banner: summary + images (optional)
interface BannerMovieWithImages extends TMDBMovieSummary {
  images?: TMDBMovieImagesResponse;
}

interface Slide {
  place: string;
  placeHtml: string;
  title: string;
  title2: string;
  description: string;
  image: string;
  detailPath: string;
  logoPath?: string | null;
}

const BannerHome: FC<BannerHomeProps> = ({ data = [] }) => {
  const imageURL = useAppSelector((state) => state.moviesData.imageURL);
  const navigate = useNavigate();

  // ====== REFS CHO DOM ======
  const demoRef = useRef<HTMLDivElement | null>(null);
  const demoCardsRef = useRef<HTMLDivElement | null>(null);
  const slideNumbersRef = useRef<HTMLDivElement | null>(null);
  const detailsEvenRef = useRef<HTMLDivElement | null>(null);
  const detailsOddRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const arrowLeftRef = useRef<HTMLDivElement | null>(null);
  const arrowRightRef = useRef<HTMLDivElement | null>(null);

  // Dùng size lớn nhất của TMDB để hạn chế mờ
  const hiResBase = useMemo(() => {
    const fallback = "https://image.tmdb.org/t/p/original/";

    if (!imageURL) return fallback;

    if (imageURL.includes("image.tmdb.org")) {
      let base = imageURL.trim();

      if (base.includes("/original")) {
        return base.endsWith("/") ? base : base + "/";
      }

      base = base.replace(/\/w\d+\/?/, "/original/");

      if (!base.endsWith("/")) base += "/";

      return base;
    }

    return imageURL.endsWith("/") ? imageURL : imageURL + "/";
  }, [imageURL]);

  const logoBase = useMemo(() => {
    const fallback = "https://image.tmdb.org/t/p/w185/";

    if (!imageURL || !imageURL.includes("image.tmdb.org")) {
      return fallback;
    }

    let base = imageURL.trim();

    // ép về size w185
    base = base.replace(/\/original\/?/, "/w185/");
    base = base.replace(/\/w\d+\/?/, "/w185/");

    if (!base.endsWith("/")) base += "/";

    return base; // vd: https://image.tmdb.org/t/p/w185/
  }, [imageURL]);

  // convert movie data -> slide cho GSAP
  const slides: Slide[] = useMemo(() => {
    return (data ?? [])
      .slice(0, 6)
      .map((m) => {
        const movie = m as BannerMovieWithImages;

        const backdrop = movie.backdrop_path;
        const poster = movie.poster_path;
        const title = movie.title || "Untitled";
        const originalTitle = movie.original_title || "";
        const overviewRaw = movie.overview?.trim() ?? "";

        const overview =
          overviewRaw.length > 0
            ? overviewRaw
            : "Hiện chưa có mô tả cho phim này.";

        const releaseDate = movie.release_date || "";
        const year = releaseDate ? releaseDate.slice(0, 4) : "";
        const lang = movie.original_language
          ? movie.original_language.toUpperCase()
          : "MOVIE";

        // ====== LOGO: chọn logo đẹp nhất từ images.logos ======
        let logoPath: string | null = null;
        const logos = movie.images?.logos ?? [];

        if (logos.length > 0) {
          const preferredLang = movie.original_language || "en";

          const heroLogo =
            logos.find((img) => img.iso_639_1 === preferredLang) ||
            logos.find((img) => img.iso_639_1 === "en") ||
            logos[0];

          logoPath = heroLogo.file_path;
        }

        // ====== META row (nếu bạn đang dùng) ======
        const place = year ? `${lang} • ${year}` : lang;
        const placeHtml = place; // hoặc meta đẹp như trước

        const imagePath = backdrop || poster || "";
        const fullImageUrl = imagePath
          ? hiResBase + imagePath.replace(/^\//, "")
          : "";

        const id = movie.id;
        const detailPath = id ? `/movie/${id.toString()}` : "";

        return {
          place,
          placeHtml,
          title,
          title2:
            originalTitle && originalTitle !== title
              ? originalTitle
              : "Now Showing",
          description: overview,
          image: fullImageUrl,
          detailPath,
          logoPath,
        };
      })
      .filter((s) => !!s.image && !!s.detailPath);
  }, [data, hiResBase]);

  // ================== GSAP LOGIC ==================
  useLayoutEffect(() => {
    if (!slides.length) return;

    const demoEl = demoRef.current;
    const demoCardsEl = demoCardsRef.current;
    const slideNumbersEl = slideNumbersRef.current;
    const detailsEvenEl = detailsEvenRef.current;
    const detailsOddEl = detailsOddRef.current;
    const indicatorEl = indicatorRef.current;
    const progressBarEl = progressRef.current;
    const arrowLeft = arrowLeftRef.current;
    const arrowRight = arrowRightRef.current;

    if (
      !demoEl ||
      !demoCardsEl ||
      !slideNumbersEl ||
      !detailsEvenEl ||
      !detailsOddEl ||
      !indicatorEl ||
      !progressBarEl
    ) {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const ease = "sine.inOut";

    let isCancelled = false;

    const ctx = gsap.context(() => {
      // ====== Tạo HTML card + nội dung từ slides ======
      const cardsHtml = slides
        .map(
          (i, index) =>
            `<div class="card absolute left-0 top-0 bg-center bg-cover bg-no-repeat shadow-[6px_6px_10px_2px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden" id="card${index}" style="background-image:url(${i.image})"></div>`
        )
        .join("");

      const cardContentsHtml = slides
        .map(
          (i, index) => `
        <div 
          class="card-content absolute inset-0 text-white/90" 
          id="card-content-${index}"
        >
          <div class="flex h-full w-full items-end">
            <div class="w-full bg-linear-to-t from-black/85 via-black/50 to-transparent p-3 md:p-4">
              <div class="text-[11px] md:text-[13px] font-medium text-white/70 flex flex-wrap items-center gap-2">
                ${i.placeHtml}
              </div>
              <div class="mt-1 font-['Oswald',sans-serif] font-semibold text-[15px] md:text-[18px] leading-tight line-clamp-2">
                ${i.title}
              </div>
              <div class="font-['Oswald',sans-serif] text-[12px] md:text-[14px] text-white/70 leading-tight line-clamp-2">
                ${i.title2}
              </div>
              <div class="text-[11px] md:text-[12px] leading-snug text-white/80 line-clamp-2">
                ${i.description}
              </div>
              <div class="cta mt-4 flex items-center max-w-[500px] gap-4 pointer-events-auto">
                <button class="bookmark w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#ecad29] text-white grid place-items-center border-none shadow-[0_8px_18px_rgba(236,173,41,0.5)]">
                  <span class="text-[16px] md:text-[18px] leading-none">★</span>
                </button>
                <button class="discover h-8 md:h-9 px-5 md:px-6 rounded-full border border-white/80 text-[10px] md:text-[11px] uppercase bg-black/30 backdrop-blur tracking-[0.18em] hover:bg-white hover:text-black transition-colors">
                  Xem chi tiết phim
                </button>
              </div>
            </div>
          </div>
        </div>`
        )
        .join("");

      const slideNumbersHtml = slides
        .map(
          (_, index) =>
            `<div class="item w-[42px] h-[42px] md:w-[50px] md:h-[50px] absolute top-0 left-0 grid place-items-center text-[22px] md:text-[28px] font-bold text-white" id="slide-item-${index}">${
              index + 1
            }</div>`
        )
        .join("");

      demoCardsEl.innerHTML = cardsHtml + cardContentsHtml;
      slideNumbersEl.innerHTML = slideNumbersHtml;

      const range = (n: number) =>
        Array(n)
          .fill(0)
          .map((_, j) => j);
      const set = gsap.set;

      const getCard = (index: number) => `#card${index}`;
      const getCardContent = (index: number) => `#card-content-${index}`;
      const getSliderItem = (index: number) => `#slide-item-${index}`;

      function animate(
        target: gsap.TweenTarget | null,
        duration: number,
        properties: gsap.TweenVars
      ) {
        if (!target) return Promise.resolve();
        return new Promise<void>((resolve) => {
          gsap.to(target, {
            ...properties,
            duration,
            onComplete: () => resolve(),
          });
        });
      }

      const order = range(slides.length);
      let detailsEven = true;

      // GẮN CLICK CHO NÚT "Xem chi tiết phim" TRONG CARD NHỎ
      {
        const cardDetailButtons =
          demoCardsEl.querySelectorAll<HTMLButtonElement>(
            ".card-content .discover"
          );
        cardDetailButtons.forEach((btn, index) => {
          btn.addEventListener("click", () => {
            const slide = slides[index];
            if (!slide || !slide.detailPath) return;
            navigate(slide.detailPath);
          });
        });

        // GẮN CLICK CHO NÚT "Xem chi tiết phim" TRONG DETAILS-EVEN / DETAILS-ODD
        const detailsButtons = demoEl.querySelectorAll<HTMLButtonElement>(
          "#details-even .discover, #details-odd .discover"
        );
        detailsButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            const activeIndex = order[0];
            const slide = slides[activeIndex];
            if (!slide || !slide.detailPath) return;
            navigate(slide.detailPath);
          });
        });
      }

      // các tham số layout
      let offsetTop = 200;
      let offsetLeft = 700;

      const cardWidth = isMobile ? 110 : 130;
      const cardHeight = isMobile ? 170 : 200;
      const gap = 16;
      const numberSize = 50;

      let isAnimating = false;

      function updateDetails(detailsEl: HTMLElement | null, index: number) {
        if (!detailsEl) return;
        const slide = slides[index];
        const place =
          detailsEl.querySelector<HTMLDivElement>(".place-box .text");
        const t1 = detailsEl.querySelector<HTMLDivElement>(".title-1");
        const t2 = detailsEl.querySelector<HTMLDivElement>(".title-2");
        const desc = detailsEl.querySelector<HTMLDivElement>(".desc");

        if (!slide || !place || !t1 || !t2 || !desc) return;

        // meta (năm, age rating, runtime, genre...) nếu có
        place.innerHTML = slide.placeHtml || slide.place;

        // ====== QUAN TRỌNG: dùng logo nếu có, nếu không dùng title ======
        if (slide.logoPath) {
          const safeTitle = slide.title.replace(/"/g, "&quot;");
          const safePath = slide.logoPath.replace(/^\//, "");

          t1.innerHTML = `
      <img
        src="${TMDB_IMAGE}${safePath}"
        alt="${safeTitle}"
        class="max-h-[60px] md:max-h-20 w-auto object-contain
               drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
      />
    `;
        } else {
          t1.textContent = slide.title;
        }

        // subtitle vẫn là chữ
        t2.textContent = slide.title2;

        desc.textContent = slide.description;
      }

      function init() {
        const [active, ...rest] = order;
        const detailsActive = detailsEven ? detailsEvenEl : detailsOddEl;
        const detailsInactive = detailsEven ? detailsOddEl : detailsEvenEl;
        const { innerHeight: height, innerWidth: width } = window;

        offsetTop = height - cardHeight - 32;
        offsetLeft = width - (cardWidth + gap) * rest.length - 32;

        set(getCard(active), {
          x: 0,
          y: 0,
          width,
          height,
          borderRadius: 0,
        });
        set(getCardContent(active), { x: 0, y: 0, opacity: 0 });

        if (detailsActive && detailsInactive) {
          set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
          set(detailsInactive, { opacity: 0, zIndex: 12 });
          set(detailsInactive.querySelectorAll(".text"), { y: 100 });
          set(detailsInactive.querySelectorAll(".title-1"), { y: 100 });
          set(detailsInactive.querySelectorAll(".title-2"), { y: 100 });
          set(detailsInactive.querySelectorAll(".desc"), { y: 50 });
          set(detailsInactive.querySelectorAll(".cta"), { y: 60 });
        }

        set(progressBarEl, {
          width: 260 * (1 / order.length) * (active + 1),
        });

        const { innerWidth: w } = window;
        set(indicatorEl, { x: -w });

        if (!isMobile) {
          rest.forEach((i, index) => {
            const x = offsetLeft + index * (cardWidth + gap);
            set(getCard(i), {
              x,
              y: offsetTop,
              width: cardWidth,
              height: cardHeight,
              zIndex: 30,
              borderRadius: 14,
            });
            set(getCardContent(i), {
              x,
              y: offsetTop,
              zIndex: 40,
            });
            set(getSliderItem(i), { x: (index + 1) * numberSize });
          });

          if (detailsActive) {
            gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: 0.2 });
          }
        } else {
          rest.forEach((i) => {
            set(getCard(i), {
              opacity: 0,
              pointerEvents: "none",
            });
            set(getCardContent(i), {
              opacity: 0,
              pointerEvents: "none",
            });
            set(getSliderItem(i), { opacity: 0 });
          });

          set(slideNumbersEl, { opacity: 0 });

          if (detailsActive) {
            gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: 0.2 });
          }
        }

        updateDetails(detailsActive, order[0]);
      }

      function step(): Promise<void> {
        if (isAnimating || isCancelled) return Promise.resolve();
        isAnimating = true;

        return new Promise<void>((resolve) => {
          order.push(order.shift() as number);
          detailsEven = !detailsEven;

          const detailsActive = detailsEven ? detailsEvenEl : detailsOddEl;
          const detailsInactive = detailsEven ? detailsOddEl : detailsEvenEl;

          updateDetails(detailsActive, order[0]);

          if (detailsActive && detailsInactive) {
            set(detailsActive, { zIndex: 22 });
            gsap.to(detailsActive, { opacity: 1, delay: 0.2, ease });
            gsap.to(detailsActive.querySelectorAll(".text"), {
              y: 0,
              delay: 0.1,
              duration: 0.7,
              ease,
            });
            gsap.to(detailsActive.querySelectorAll(".title-1"), {
              y: 0,
              delay: 0.15,
              duration: 0.7,
              ease,
            });
            gsap.to(detailsActive.querySelectorAll(".title-2"), {
              y: 0,
              delay: 0.15,
              duration: 0.7,
              ease,
            });
            gsap.to(detailsActive.querySelectorAll(".desc"), {
              y: 0,
              delay: 0.25,
              duration: 0.4,
              ease,
            });
            gsap.to(detailsActive.querySelectorAll(".cta"), {
              y: 0,
              delay: 0.3,
              duration: 0.4,
              ease,
            });
            set(detailsInactive, { zIndex: 12 });
          }

          const [active, ...rest] = order;
          const prv = rest[rest.length - 1];

          const { innerWidth: width, innerHeight: height } = window;

          const offsetTopLocal = height - cardHeight - 32;
          const offsetLeftLocal = width - (cardWidth + gap) * rest.length - 32;

          set(getCard(active), { opacity: 1, pointerEvents: "auto" });

          set(getCard(prv), { zIndex: 10 });
          set(getCard(active), { zIndex: 20 });
          gsap.to(getCard(prv), { scale: 1.5, ease });

          gsap.to(getCardContent(active), {
            opacity: 0,
            duration: 0.3,
            ease,
          });
          gsap.to(getSliderItem(active), { x: 0, ease });
          gsap.to(getSliderItem(prv), { x: -numberSize, ease });
          gsap.to(progressBarEl, {
            width: 260 * (1 / order.length) * (active + 1),
            ease,
          });

          gsap.to(getCard(active), {
            x: 0,
            y: 0,
            ease,
            width,
            height,
            borderRadius: 0,
            onComplete: () => {
              if (!isMobile) {
                const xNew =
                  offsetLeftLocal + (rest.length - 1) * (cardWidth + gap);
                set(getCard(prv), {
                  x: xNew,
                  y: offsetTopLocal,
                  width: cardWidth,
                  height: cardHeight,
                  zIndex: 30,
                  borderRadius: 14,
                  scale: 1,
                });

                set(getCardContent(prv), {
                  x: xNew,
                  y: offsetTopLocal,
                  opacity: 1,
                  zIndex: 40,
                });
                set(getSliderItem(prv), {
                  x: rest.length * numberSize,
                });
              } else {
                set(getCard(prv), { opacity: 0, pointerEvents: "none" });
                set(getCardContent(prv), {
                  opacity: 0,
                  pointerEvents: "none",
                });
              }

              if (detailsInactive) {
                set(detailsInactive, { opacity: 0 });
                set(detailsInactive.querySelectorAll(".text"), { y: 100 });
                set(detailsInactive.querySelectorAll(".title-1"), { y: 100 });
                set(detailsInactive.querySelectorAll(".title-2"), { y: 100 });
                set(detailsInactive.querySelectorAll(".desc"), { y: 50 });
                set(detailsInactive.querySelectorAll(".cta"), { y: 60 });
              }

              isAnimating = false;
              resolve();
            },
          });

          if (!isMobile) {
            rest.forEach((i, index) => {
              if (i !== prv) {
                const xNew = offsetLeftLocal + index * (cardWidth + gap);
                set(getCard(i), { zIndex: 30 });
                gsap.to(getCard(i), {
                  x: xNew,
                  y: offsetTopLocal,
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: 14,
                  ease,
                  delay: 0.05 * (index + 1),
                });

                gsap.to(getCardContent(i), {
                  x: xNew,
                  y: offsetTopLocal,
                  opacity: 1,
                  zIndex: 40,
                  ease,
                  delay: 0.05 * (index + 1),
                });
                gsap.to(getSliderItem(i), {
                  x: (index + 1) * numberSize,
                  ease,
                });
              }
            });
          }
        });
      }

      async function loop() {
        const indicator = indicatorEl;
        while (!isCancelled) {
          const { innerWidth: width } = window;

          await animate(indicator, 2, { x: 0 });
          if (isCancelled) break;

          await animate(indicator, 0.8, {
            x: width,
            delay: 0.3,
          });
          if (isCancelled) break;

          gsap.set(indicator, { x: -width });

          await step();
        }
      }

      function loadImage(src: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      }

      async function loadImages() {
        const promises = slides.map(({ image }) => loadImage(image));
        return Promise.all(promises);
      }

      const handleNext = () => {
        if (!isAnimating && !isCancelled) {
          void step();
        }
      };

      const handlePrev = () => {
        if (isAnimating || order.length <= 1 || isCancelled) return;
        const last1 = order.pop();
        if (last1 !== undefined) order.unshift(last1);
        const last2 = order.pop();
        if (last2 !== undefined) order.unshift(last2);
        void step();
      };

      arrowRight?.addEventListener("click", handleNext);
      arrowLeft?.addEventListener("click", handlePrev);

      async function start() {
        try {
          await loadImages();
          if (isCancelled) return;
          init();
          await loop();
        } catch (error) {
          console.error("One or more images failed to load", error);
        }
      }

      void start();

      return () => {
        arrowRight?.removeEventListener("click", handleNext);
        arrowLeft?.removeEventListener("click", handlePrev);
        demoCardsEl.innerHTML = "";
        slideNumbersEl.innerHTML = "";
      };
    }, demoRef);

    return () => {
      isCancelled = true;
      ctx.revert();
    };
  }, [slides, navigate, logoBase]);

  // layout hero: mobile ~70% màn hình, desktop full
  return (
    <div className="relative h-[70vh] md:h-screen w-full bg-black text-white overflow-hidden font-sans">
      {/* thanh vàng chạy trên đầu */}
      <div
        ref={indicatorRef}
        className="indicator fixed left-0 right-0 top-0 h-[5px] bg-[#ecad29] z-40"
      />

      {/* HERO CONTAINER */}
      <div id="demo" ref={demoRef} className="relative w-full h-full">
        {/* overlay làm tối bên trái */}
        <div
          className="absolute inset-0 bg-linear-to-r 
                    from-black/50 via-black/30 to-transparent 
                    pointer-events-none z-10"
        />

        {/* nơi inject card bằng innerHTML */}
        <div
          id="demo-cards"
          ref={demoCardsRef}
          className="absolute inset-0 z-0"
        />

        {/* details EVEN */}
        <div
          id="details-even"
          ref={detailsEvenRef}
          className="details absolute top-30 left-5 md:top-20 md:left-10 
                 z-30 max-w-[540px]"
        >
          <div className="place-box h-10 overflow-hidden relative">
            <div className="text pt-3 text-[14px] md:text-[18px] tracking-wide flex flex-wrap items-center gap-2">
              <span
                className="absolute w-[26px] h-0.5 md:w-[30px] md:h-[3px] 
                           rounded-full bg-[#ecad29] left-0 top-0"
              />
            </div>
          </div>

          <div className="title-box-1 mt-1 h-[72px] md:h-30 overflow-hidden">
            <div
              className="title-1 font-['Oswald',sans-serif] font-semibold 
                          text-[32px] md:text-[60px] leading-none
                          drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
            />
          </div>

          <div className="title-box-2 mt-1 md:h-10 overflow-hidden">
            <div
              className="title-2 font-['Oswald',sans-serif] font-medium 
                        text-[22px] md:text-[36px] leading-none uppercase 
                        text-white drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)]"
            />
          </div>

          <div
            className="desc mt-4 w-[300px] h-[75px] md:w-[520px] md:h-[110px] 
                      text-[13px] md:text-[14px] leading-relaxed text-white/90 
                      overflow-y-auto"
          />

          <div className="cta mt-6 flex items-center max-w-[500px] gap-4">
            <button
              className="bookmark w-9 h-9 rounded-full bg-[#ecad29] 
                           text-white grid place-items-center border-none 
                           shadow-[0_8px_18px_rgba(236,173,41,0.5)]"
            >
              <span className="text-[18px] leading-none">★</span>
            </button>

            <button
              className="discover h-9 px-6 rounded-full border border-white/80 
                           text-[11px] md:text-[12px] uppercase bg-black/30 
                           backdrop-blur tracking-[0.18em] 
                           hover:bg-white hover:text-black transition-colors"
            >
              Xem chi tiết phim
            </button>
          </div>
        </div>

        {/* details ODD */}
        <div
          id="details-odd"
          ref={detailsOddRef}
          className="details absolute top-30 left-5 md:top-20 md:left-10 
                 z-20 max-w-[540px]"
        >
          <div className="place-box h-10 overflow-hidden relative">
            <div className="text pt-3 text-[14px] md:text-[18px] tracking-wide flex flex-wrap items-center gap-2">
              <span
                className="absolute w-[26px] h-0.5 md:w-[30px] md:h-[3px] 
                           rounded-full bg-[#ecad29] left-0 top-0"
              />
            </div>
          </div>

          <div className="title-box-1 mt-1 h-[72px] md:h-30 overflow-hidden">
            <div
              className="title-1 font-['Oswald',sans-serif] font-semibold 
                        text-[32px] md:text-[60px] leading-none uppercase"
            />
          </div>

          <div className="title-box-2 mt-1 md:h-10 overflow-hidden">
            <div
              className="title-2 font-['Oswald',sans-serif] font-medium 
                        text-[22px] md:text-[36px] leading-none uppercase 
                        text-white/90"
            />
          </div>

          <div
            className="desc mt-4 w-[300px] h-[75px] md:w-[520px] md:h-[110px] 
                      text-[13px] md:text-[14px] leading-relaxed text-white/85 
                      overflow-y-auto"
          />

          <div className="cta mt-6 flex items-center max-w-[500px] gap-4">
            <button
              className="bookmark w-9 h-9 rounded-full bg-[#ecad29] 
                           text-white grid place-items-center border-none"
            >
              <span className="text-[18px] leading-none">★</span>
            </button>

            <button
              className="discover h-9 px-6 rounded-full border border-white/80 
                           text-[11px] md:text-[12px] uppercase bg-black/30 
                           backdrop-blur tracking-[0.18em]"
            >
              Xem chi tiết phim
            </button>
          </div>
        </div>

        {/* pagination + progress + slide numbers */}
        <div
          id="pagination"
          className="pagination hidden md:inline-flex absolute left-4 md:left-6 bottom-4 md:bottom-6  items-center gap-4 md:gap-5 z-80 pointer-events-auto"
        >
          <div
            ref={arrowLeftRef}
            className="arrow arrow-left w-10 h-10 md:w-[46px] md:h-[46px] rounded-full border-2 border-white/30 grid place-items-center bg-black/40 backdrop-blur hover:border-white/70 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6 text-white/75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div
            ref={arrowRightRef}
            className="arrow arrow-right w-10 h-10 md:w-[46px] md:h-[46px] rounded-full border-2 border-white/30 grid place-items-center bg-black/40 backdrop-blur ml-1 md:ml-3 hover:border-white/70 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6 text-white/75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>

          <div className="progress-sub-container ml-2 md:ml-4 flex items-center h-[42px] w-[190px] md:w-60">
            <div className="progress-sub-background w-full h-[3px] bg-white/25 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="progress-sub-foreground h-[3px] bg-[#ecad29]"
              />
            </div>
          </div>

          <div
            id="slide-numbers"
            ref={slideNumbersRef}
            className="slide-numbers relative w-[42px] h-[42px] md:w-[50px] md:h-[50px] overflow-hidden z-30 bg-black/40 rounded-full border border-white/20 backdrop-blur"
          />
        </div>
      </div>
    </div>
  );
};

export default BannerHome;
