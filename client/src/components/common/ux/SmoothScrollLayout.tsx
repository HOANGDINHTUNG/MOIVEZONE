// src/components/common/layout/SmoothScrollLayout.tsx
import React, { useEffect, useRef } from "react";

interface SmoothScrollLayoutProps {
  children: React.ReactNode;
  /**
   * Độ mượt (0–1).
   * Càng nhỏ thì trôi càng lâu, cảm giác có nhiều "đà" hơn.
   * Gợi ý: 0.06 – 0.12
   */
  ease?: number;
}

const SmoothScrollLayout: React.FC<SmoothScrollLayoutProps> = ({
  children,
  ease = 0.08,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const current = useRef(0);
  const target = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const content = contentRef.current;

    if (!content) return;

    // Tắt scroll-behavior mặc định để tránh xung đột
    html.style.scrollBehavior = "auto";
    body.style.overflow = "auto";

    // Đặt chiều cao body theo chiều cao thật của content
    const setBodyHeight = () => {
      const h = content.scrollHeight; // chiều cao toàn bộ nội dung
      body.style.height = `${h}px`;
    };

    setBodyHeight();

    // Nếu nội dung thay đổi (route khác, data TMDB load xong...) thì cập nhật height
    let resizeObserver: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        setBodyHeight();
      });
      resizeObserver.observe(content);
    }

    // Lắng nghe scroll thật
    const onScroll = () => {
      target.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll);

    content.style.willChange = "transform";

    const smoothScroll = () => {
      // Lerp / easing → tạo cảm giác trôi, có đà
      current.current += (target.current - current.current) * ease;
      const y = Math.round(current.current * 100) / 100;
      content.style.transform = `translate3d(0, -${y}px, 0)`;

      rafId.current = window.requestAnimationFrame(smoothScroll);
    };

    smoothScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", setBodyHeight);
      }
      if (rafId.current) cancelAnimationFrame(rafId.current);

      // reset style khi unmount
      body.style.height = "";
      body.style.overflow = "";
      html.style.scrollBehavior = "";
      content.style.transform = "";
      content.style.willChange = "";
    };
  }, [ease]);

  return (
    <div className="fixed inset-0 w-full overflow-hidden">
      <div ref={contentRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
};

export default SmoothScrollLayout;
