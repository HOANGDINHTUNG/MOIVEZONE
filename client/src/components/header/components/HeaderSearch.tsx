// src/components/header/HeaderSearch.tsx
import React, { useState,type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

type HeaderSearchProps = {
  className?: string;
};

const HeaderSearch: React.FC<HeaderSearchProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy query hiện tại từ URL để đồng bộ input
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("s") ?? "";

  const [term, setTerm] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) return;

    // Điều hướng đến trang search với ?s=...
    navigate(`/search?s=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        "hidden md:flex items-center rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[13px] " +
        className
      }
    >
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search movie..."
        className="bg-transparent outline-none placeholder:text-white/40 text-white w-32"
      />
      <button type="submit" className="ml-1 flex items-center justify-center">
        <FiSearch className="w-4 h-4 text-white/70" />
      </button>
    </form>
  );
};

export default HeaderSearch;
