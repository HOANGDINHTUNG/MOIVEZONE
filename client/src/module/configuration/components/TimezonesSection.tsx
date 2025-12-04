import { useMemo, useState } from "react";
import type { TMDBTimezone } from "../database/interface/configuration";

interface TimezonesSectionProps {
  timezones: TMDBTimezone[];
}

export const TimezonesSection = ({ timezones }: TimezonesSectionProps) => {
  const [countryFilter, setCountryFilter] = useState("");

  const filtered = useMemo(() => {
    const q = countryFilter.trim().toLowerCase();
    if (!q) return timezones;
    return timezones.filter((t) => t.iso_3166_1.toLowerCase().includes(q));
  }, [timezones, countryFilter]);

  return (
    <div className="space-y-3">
      {/* Filter + stats */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="w-full sm:max-w-xs rounded-lg border border-slate-300 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/60 dark:bg-slate-900/70 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Filter by country code (US, VN, JP…)"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        />
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Countries with timezones:{" "}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {timezones.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <div
            key={t.iso_3166_1}
            className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/70"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Country: {t.iso_3166_1}
              </h2>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {t.zones.length} zone
              </span>
            </div>
            <div className="max-h-40 space-y-1 overflow-auto text-xs text-slate-700 dark:text-slate-200">
              {t.zones.map((zone) => (
                <div key={zone} className="truncate">
                  {zone}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-xs text-slate-500 dark:text-slate-400">
            Không tìm thấy timezone cho country code này.
          </div>
        )}
      </div>
    </div>
  );
};
