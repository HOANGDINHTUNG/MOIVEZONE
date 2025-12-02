// src/components/header/NeonHeaderSearch.tsx
import React, { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StyledWrapper } from "../ui/Search";

const NeonHeaderSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("s") ?? "";
  const [term, setTerm] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) return;
    navigate(`/search?s=${encodeURIComponent(trimmed)}`);
  };

  return (
    <StyledWrapper>
      <form onSubmit={handleSubmit}>
        <div id="poda">
          {/* Các layer hiệu ứng */}
          <div className="glow" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="white" />
          <div className="border" />

          <div id="main">
            <input
              placeholder="Search..."
              type="text"
              name="text"
              className="input"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <div id="input-mask" />
            <div id="pink-mask" />

            {/* icon search (click = submit) */}
            <button id="search-icon" type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                className="feather feather-search"
              >
                <circle stroke="url(#search)" r={8} cy={11} cx={11} />
                <line
                  stroke="url(#searchl)"
                  y2="16.65"
                  y1={22}
                  x2="16.65"
                  x1={22}
                />
                <defs>
                  <linearGradient gradientTransform="rotate(50)" id="search">
                    <stop stopColor="#f8e7f8" offset="0%" />
                    <stop stopColor="#b6a9b7" offset="50%" />
                  </linearGradient>
                  <linearGradient id="searchl">
                    <stop stopColor="#b6a9b7" offset="0%" />
                    <stop stopColor="#837484" offset="50%" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </StyledWrapper>
  );
};

export default NeonHeaderSearch;
