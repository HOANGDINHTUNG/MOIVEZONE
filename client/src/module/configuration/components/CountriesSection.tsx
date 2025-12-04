import { useMemo, useState } from "react";
import type { TMDBCountry } from "../database/interface/configuration";

interface CountriesSectionProps {
  countries: TMDBCountry[];
}

export const CountriesSection = ({ countries }: CountriesSectionProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.iso_3166_1.toLowerCase().includes(q) ||
        c.english_name.toLowerCase().includes(q) ||
        c.native_name.toLowerCase().includes(q)
    );
  }, [countries, query]);

  return (
    <div className="space-y-3">
      {/* Search + stats */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="w-full sm:max-w-xs rounded-lg border border-slate-300 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/60 dark:bg-slate-900/70 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Search by name or country code…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Total:{" "}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {countries.length}
          </span>{" "}
          countries
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-200/80 bg-white/80 shadow-sm dark:bg-slate-900/70 dark:border-slate-700/70">
        <table className="min-w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm dark:bg-slate-900/90">
            <tr className="border-b border-slate-200/80 dark:border-slate-700/80">
              <th className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200 w-20">
                Code
              </th>
              <th className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200">
                English name
              </th>
              <th className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200">
                Native name
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.iso_3166_1}
                className="border-b border-slate-100/80 last:border-0 dark:border-slate-800/80"
              >
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full border border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200">
                    {c.iso_3166_1}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                  {c.english_name}
                </td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                  {c.native_name || (
                    <span className="text-slate-400 dark:text-slate-500">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                >
                  Không tìm thấy quốc gia phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
