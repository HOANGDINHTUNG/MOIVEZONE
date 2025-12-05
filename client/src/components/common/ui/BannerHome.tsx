// src/components/common/ui/BannerHome.tsx
import React, { useEffect, useMemo } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import type { TMDBMovieSummary } from "../../../module/movies/database/interface/movie";

interface BannerHomeProps {
  data?: TMDBMovieSummary[];
}

interface Slide {
  place: string;
  title: string;
  title2: string;
  description: string;
  image: string;
  detailPath: string;
}

// Gom hết field có thể có của movie/tv để khỏi dùng any
interface MovieWithOptionalFields extends Partial<TMDBMovieSummary> {
  id?: number;
  backdrop_path?: string;
  poster_path?: string;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
  media_type?: "movie" | "tv" | string;
}

const BannerHome: React.FC<BannerHomeProps> = ({ data = [] }) => {
  const imageURL = useAppSelector((state) => state.moviesData.imageURL);
  const navigate = useNavigate();

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

  // convert movie data -> slide cho GSAP
  const slides: Slide[] = useMemo(() => {
    return data
      .slice(0, 6)
      .map((m) => {
        const movie = m as MovieWithOptionalFields;

        const backdrop = movie.backdrop_path;
        const poster = movie.poster_path;
        const title = movie.title || movie.name || "Untitled";
        const originalTitle = movie.original_title || movie.original_name || "";
        const overviewRaw = movie.overview?.trim() ?? "";

        const overview =
          overviewRaw.length > 0
            ? overviewRaw
            : "Hiện chưa có mô tả cho phim này.";

        const releaseDate = movie.release_date || movie.first_air_date || "";
        const year = releaseDate ? releaseDate.slice(0, 4) : "";

        const lang = movie.original_language
          ? movie.original_language.toUpperCase()
          : "MOVIE";

        const imagePath = backdrop || poster || "";
        const fullImageUrl = imagePath
          ? hiResBase + imagePath.replace(/^\//, "")
          : "";

        const id = movie.id;
        const mediaTypeRaw = movie.media_type;
        const isMovieGuess =
          !!movie.title || !!movie.original_title || mediaTypeRaw === "movie";
        let mediaType: "movie" | "tv" = isMovieGuess ? "movie" : "tv";

        if (mediaTypeRaw === "tv" || mediaTypeRaw === "movie") {
          mediaType = mediaTypeRaw;
        }

        const detailPath =
          id !== undefined ? `/${mediaType}/${id.toString()}` : "";

        return {
          place: year ? `${lang} • ${year}` : lang,
          title,
          title2:
            originalTitle && originalTitle !== title
              ? originalTitle
              : "Now Showing",
          description: overview,
          image: fullImageUrl,
          detailPath,
        };
      })
      .filter((s) => !!s.image && !!s.detailPath);
  }, [data, hiResBase]);

  useEffect(() => {
    if (!slides.length) return;

    const _ = (id: string) => document.getElementById(id)!;

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
            <div class="text-[11px] md:text-[13px] font-medium text-white/70">
              ${i.place}
            </div>
            <div class="mt-1 font-['Oswald',sans-serif] font-semibold text-[15px] md:text-[18px] leading-tight line-clamp-2">
              ${i.title}
            </div>
            <div class="font-['Oswald',sans-serif] text-[12px] md:text-[14px] text-white/70 leading-tight line-clamp-2">
              ${i.title2}
            </div>
            <div class=" text-[11px] md:text-[12px] leading-snug text-white/80 line-clamp-2">
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

    const demoCardsEl = _("demo-cards");
    const slideNumbersEl = _("slide-numbers");

    demoCardsEl.innerHTML = "";
    slideNumbersEl.innerHTML = "";

    demoCardsEl.innerHTML = cardsHtml + cardContentsHtml;
    slideNumbersEl.innerHTML = slideNumbersHtml;

    // ========== GSAP LOGIC ==========
    const range = (n: number) =>
      Array(n)
        .fill(0)
        .map((_, j) => j);
    const set = gsap.set;

    const getCard = (index: number) => `#card${index}`;
    const getCardContent = (index: number) => `#card-content-${index}`;
    const getSliderItem = (index: number) => `#slide-item-${index}`;

    function animate(
      target: gsap.TweenTarget,
      duration: number,
      properties: gsap.TweenVars
    ) {
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
      const cardDetailButtons = demoCardsEl.querySelectorAll(
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
      const detailsButtons = document.querySelectorAll(
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

    // card nhỏ: responsive theo kích thước màn hình
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 110 : 130;
    const cardHeight = isMobile ? 170 : 200;
    const gap = 16;
    const numberSize = 50;
    const ease = "sine.inOut";

    let isAnimating = false;

    function updateDetails(detailsSelector: string, index: number) {
      const slide = slides[index];
      const place = document.querySelector<HTMLDivElement>(
        `${detailsSelector} .place-box .text`
      );
      const t1 = document.querySelector<HTMLDivElement>(
        `${detailsSelector} .title-1`
      );
      const t2 = document.querySelector<HTMLDivElement>(
        `${detailsSelector} .title-2`
      );
      const desc = document.querySelector<HTMLDivElement>(
        `${detailsSelector} .desc`
      );

      if (!slide || !place || !t1 || !t2 || !desc) return;

      place.textContent = slide.place;
      t1.textContent = slide.title;
      t2.textContent = slide.title2;
      desc.textContent = slide.description;
    }

    function init() {
      const [active, ...rest] = order;
      const detailsActive = detailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
      const { innerHeight: height, innerWidth: width } = window;

      // hero full màn hình
      offsetTop = height - cardHeight - 32;
      offsetLeft = width - (cardWidth + gap) * rest.length - 32;

      // card active full screen
      set(getCard(active), {
        x: 0,
        y: 0,
        width,
        height,
        borderRadius: 0,
      });
      set(getCardContent(active), { x: 0, y: 0, opacity: 0 });

      set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
      set(detailsInactive, { opacity: 0, zIndex: 12 });
      set(`${detailsInactive} .text`, { y: 100 });
      set(`${detailsInactive} .title-1`, { y: 100 });
      set(`${detailsInactive} .title-2`, { y: 100 });
      set(`${detailsInactive} .desc`, { y: 50 });
      set(`${detailsInactive} .cta`, { y: 60 });

      set(".progress-sub-foreground", {
        width: 260 * (1 / order.length) * (active + 1),
      });

      const { innerWidth: w } = window;
      set(".indicator", { x: -w });

      if (!isMobile) {
        // DESKTOP: giữ thumbnail như cũ
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

        gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: 0.2 });
      } else {
        // MOBILE: ẩn card nhỏ + số
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

        set("#slide-numbers", { opacity: 0 });

        gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: 0.2 });
      }

      updateDetails(detailsActive, order[0]);
    }

    function step(): Promise<void> {
      if (isAnimating) return Promise.resolve();
      isAnimating = true;

      return new Promise<void>((resolve) => {
        order.push(order.shift() as number);
        detailsEven = !detailsEven;

        const detailsActive = detailsEven ? "#details-even" : "#details-odd";
        const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

        updateDetails(detailsActive, order[0]);

        set(detailsActive, { zIndex: 22 });
        gsap.to(detailsActive, { opacity: 1, delay: 0.2, ease });
        gsap.to(`${detailsActive} .text`, {
          y: 0,
          delay: 0.1,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .title-1`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .title-2`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .desc`, {
          y: 0,
          delay: 0.25,
          duration: 0.4,
          ease,
        });
        gsap.to(`${detailsActive} .cta`, {
          y: 0,
          delay: 0.3,
          duration: 0.4,
          ease,
        });
        set(detailsInactive, { zIndex: 12 });

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
        gsap.to(".progress-sub-foreground", {
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
              // DESKTOP: đặt lại prev thành thumbnail
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
              // MOBILE: prev vẫn ẩn
              set(getCard(prv), { opacity: 0, pointerEvents: "none" });
              set(getCardContent(prv), {
                opacity: 0,
                pointerEvents: "none",
              });
            }

            set(detailsInactive, { opacity: 0 });
            set(`${detailsInactive} .text`, { y: 100 });
            set(`${detailsInactive} .title-1`, { y: 100 });
            set(`${detailsInactive} .title-2`, { y: 100 });
            set(`${detailsInactive} .desc`, { y: 50 });
            set(`${detailsInactive} .cta`, { y: 60 });

            isAnimating = false;
            resolve();
          },
        });

        if (!isMobile) {
          // reposition lại thumbnail chỉ trên desktop
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
      const { innerWidth: width } = window;
      await animate(".indicator", 2, { x: 0 });
      await animate(".indicator", 0.8, {
        x: width,
        delay: 0.3,
      });
      set(".indicator", { x: -width });
      await step();
      loop();
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

    const arrowLeft = document.querySelector<HTMLDivElement>(".arrow-left");
    const arrowRight = document.querySelector<HTMLDivElement>(".arrow-right");

    const handleNext = () => {
      if (!isAnimating) {
        void step();
      }
    };

    const handlePrev = () => {
      if (isAnimating || order.length <= 1) return;
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
        init();
        loop();
      } catch (error) {
        console.error("One or more images failed to load", error);
      }
    }

    start();

    return () => {
      gsap.globalTimeline.clear();
      demoCardsEl.innerHTML = "";
      slideNumbersEl.innerHTML = "";
      arrowRight?.removeEventListener("click", handleNext);
      arrowLeft?.removeEventListener("click", handlePrev);
    };
  }, [slides, navigate]);

  // layout hero: mobile ~70% màn hình, desktop full
  return (
    <div className="relative h-[70vh] md:h-screen w-full bg-black text-white overflow-hidden font-sans">
      {/* thanh vàng chạy trên đầu */}
      <div className="indicator fixed left-0 right-0 top-0 h-[5px] bg-[#ecad29] z-40" />

      {/* HERO CONTAINER */}
      <div id="demo" className="relative w-full h-full">
        {/* nơi inject card bằng innerHTML */}
        <div id="demo-cards" className="absolute inset-0" />

        {/* details EVEN */}
        <div
          id="details-even"
          className="details absolute top-24 left-[18px] md:top-36 md:left-[60px] z-22 max-w-[540px]"
        >
          <div className="place-box h-10 overflow-hidden relative">
            <div className="text pt-3 text-[14px] md:text-[18px] tracking-wide">
              <span className="absolute w-[26px] h-0.5 md:w-[30px] md:h-[3px] rounded-full bg-[#ecad29] left-0 top-0" />
            </div>
          </div>
          <div className="title-box-1 mt-1 h-[72px] md:h-[110px] overflow-hidden">
            <div className="title-1 font-['Oswald',sans-serif] font-semibold text-[32px] md:text-[60px] leading-none uppercase drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]" />
          </div>
          <div className="title-box-2 mt-1 h-[60px] md:h-20 overflow-hidden">
            <div className="title-2 font-['Oswald',sans-serif] font-medium text-[22px] md:text-[36px] leading-none uppercase text-white/80 drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)]" />
          </div>
          <div className="desc mt-4 max-w-[520px] text-[13px] md:text-[14px] leading-relaxed text-white/80" />
          <div className="cta mt-6 flex items-center max-w-[500px] gap-4">
            <button className="bookmark w-9 h-9 rounded-full bg-[#ecad29] text-white grid place-items-center border-none shadow-[0_8px_18px_rgba(236,173,41,0.5)]">
              <span className="text-[18px] leading-none">★</span>
            </button>
            <button className="discover h-9 px-6 rounded-full border border-white/80 text-[11px] md:text-[12px] uppercase bg-black/30 backdrop-blur tracking-[0.18em] hover:bg-white hover:text-black transition-colors">
              Xem chi tiết phim
            </button>
          </div>
        </div>

        {/* details ODD (crossfade) */}
        <div
          id="details-odd"
          className="details absolute top-24 left-[18px] md:top-36 md:left-[60px] z-12 max-w-[540px]"
        >
          <div className="place-box h-10 overflow-hidden relative">
            <div className="text pt-3 text-[14px] md:text-[18px] tracking-wide">
              <span className="absolute w-[26px] h-0.5 md:w-[30px] md:h-[3px] rounded-full bg-[#ecad29] left-0 top-0" />
            </div>
          </div>
          <div className="title-box-1 mt-1 h-[72px] md:h-[110px] overflow-hidden">
            <div className="title-1 font-['Oswald',sans-serif] font-semibold text-[32px] md:text-[60px] leading-none uppercase" />
          </div>
          <div className="title-box-2 mt-1 h-[60px] md:h-20 overflow-hidden">
            <div className="title-2 font-['Oswald',sans-serif] font-medium text-[22px] md:text-[36px] leading-none uppercase text-white/80" />
          </div>
          <div className="desc mt-4 max-w-[520px] text-[13px] md:text-[14px] leading-relaxed text-white/80" />
          <div className="cta mt-6 flex items-center max-w-[500px] gap-4">
            <button className="bookmark w-9 h-9 rounded-full bg-[#ecad29] text-white grid place-items-center border-none">
              <span className="text-[18px] leading-none">★</span>
            </button>
            <button className="discover h-9 px-6 rounded-full border border-white/80 text-[11px] md:text-[12px] uppercase bg-black/30 backdrop-blur tracking-[0.18em]">
              Xem chi tiết phim
            </button>
          </div>
        </div>

        {/* pagination + progress + slide numbers */}
        <div
          id="pagination"
          className="pagination hidden md:inline-flex absolute left-4 md:left-6 bottom-4 md:bottom-6  items-center gap-4 md:gap-5 z-80 pointer-events-auto"
        >
          <div className="arrow arrow-left w-10 h-10 md:w-[46px] md:h-[46px] rounded-full border-2 border-white/30 grid place-items-center bg-black/40 backdrop-blur hover:border-white/70 transition-colors cursor-pointer">
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
          <div className="arrow arrow-right w-10 h-10 md:w-[46px] md:h-[46px] rounded-full border-2 border-white/30 grid place-items-center bg-black/40 backdrop-blur ml-1 md:ml-3 hover:border-white/70 transition-colors cursor-pointer">
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
              <div className="progress-sub-foreground h-[3px] bg-[#ecad29]" />
            </div>
          </div>

          <div
            id="slide-numbers"
            className="slide-numbers relative w-[42px] h-[42px] md:w-[50px] md:h-[50px] overflow-hidden z-30 bg-black/40 rounded-full border border-white/20 backdrop-blur"
          />
        </div>
      </div>
    </div>
  );
};

export default BannerHome;
