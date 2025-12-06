// src/components/header/NeonHeaderSearch.tsx
import React, { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StyledWrapper } from "../ui/Search";
import { BiSearch } from "react-icons/bi";

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
      <form onSubmit={handleSubmit} className="align-center">
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
            <button
              id="search-icon"
              type="submit"
              className="flex items-center justify-center"
            >
              <BiSearch className="w-6 h-6" />
            </button>
          </div>
        </div>
      </form>
    </StyledWrapper>
  );
};

export default NeonHeaderSearch;
