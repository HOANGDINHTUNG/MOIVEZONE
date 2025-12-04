// src/module/search/components/SearchTabs.tsx
import type { SearchCategory } from "../../../api/movie/TMDBSearch.api";
import clsx from "clsx";

const tabs: { id: SearchCategory; label: string }[] = [
  { id: "multi", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
  { id: "person", label: "People" },
  { id: "collection", label: "Collections" },
  { id: "company", label: "Companies" },
  { id: "keyword", label: "Keywords" },
];

interface SearchTabsProps {
  active: SearchCategory;
  onChange: (c: SearchCategory) => void;
}

export default function SearchTabs({ active, onChange }: SearchTabsProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2 rounded-full bg-neutral-900/70 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={clsx(
            "relative rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition-all",
            "text-neutral-300 hover:text-white",
            active === tab.id &&
              "bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/40"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
