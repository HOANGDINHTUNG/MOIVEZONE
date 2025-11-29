// src/module/configuration/components/LanguagesSection.tsx
import { useMemo, useState } from "react";
import type { TMDBLanguage } from "../database/interface/configuration";

interface LanguagesSectionProps {
  languages: TMDBLanguage[];
  primaryTranslations: string[];
}

export const LanguagesSection = ({
  languages,
  primaryTranslations,
}: LanguagesSectionProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (l) =>
        l.iso_639_1.toLowerCase().includes(q) ||
        l.english_name.toLowerCase().includes(q) ||
        (l.name || "").toLowerCase().includes(q)
    );
  }, [languages, query]);

  const primarySet = useMemo(
    () => new Set(primaryTranslations),
    [primaryTranslations]
  );

  return (
    <div className="space-y-3">
      {/* Search + stats */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="w-full sm:max-w-xs rounded-lg border border-slate-300 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/60 dark:bg-slate-900/70 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Search language (code, English, native)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="text-xs text-slate-600 dark:text-slate-400">
          <div>
            Total:{" "}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {languages.length}
            </span>{" "}
            languages
          </div>
          <div>
            Primary translations:{" "}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {primaryTranslations.length}
            </span>
          </div>
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
              <th className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-200 w-24">
                Primary?
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const isPrimary = primarySet.has(l.iso_639_1);
              return (
                <tr
                  key={l.iso_639_1}
                  className="border-b border-slate-100/80 last:border-0 dark:border-slate-800/80"
                >
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full border border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200">
                      {l.iso_639_1}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                    {l.english_name}
                  </td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                    {l.name || (
                      <span className="text-slate-400 dark:text-slate-500">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {isPrimary ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Yes
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        No
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
                >
                  Không tìm thấy ngôn ngữ phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
