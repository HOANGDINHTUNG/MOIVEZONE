import type { TMDBConfigurationResponse } from "../database/interface/configuration";

interface OverviewSectionProps {
  configuration: TMDBConfigurationResponse | null;
  totals: {
    countries: number;
    jobsDepartments: number;
    languages: number;
    primaryTranslations: number;
    timezones: number;
  };
}

export const OverviewSection = ({
  configuration,
  totals,
}: OverviewSectionProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Images Base URL */}
      <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/70">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Images Base URL
          </h2>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Images
          </span>
        </div>
        {configuration ? (
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <div>
              <span className="font-medium">Base URL: </span>
              <span className="break-all">{configuration.images.base_url}</span>
            </div>
            <div>
              <span className="font-medium">Secure: </span>
              <span className="break-all">
                {configuration.images.secure_base_url}
              </span>
            </div>
            <p className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Khi build URL ảnh:{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                secure_base_url + size + path
              </code>
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Không có dữ liệu.
          </p>
        )}
      </div>

      {/* Meta Counts */}
      <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/70">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Meta Counts
          </h2>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Stats
          </span>
        </div>
        <ul className="mt-1 space-y-1 text-xs text-slate-700 dark:text-slate-300">
          <li>Countries: {totals.countries}</li>
          <li>Departments: {totals.jobsDepartments}</li>
          <li>Languages: {totals.languages}</li>
          <li>Primary translations: {totals.primaryTranslations}</li>
          <li>Timezones: {totals.timezones}</li>
        </ul>
      </div>

      {/* Change keys */}
      <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/70">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Change Keys
          </h2>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Changes
          </span>
        </div>
        {configuration ? (
          <div className="max-h-40 overflow-auto pr-1">
            <div className="flex flex-wrap gap-1.5">
              {configuration.change_keys.map((key) => (
                <span
                  key={key}
                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Không có dữ liệu.
          </p>
        )}
      </div>
    </div>
  );
};
