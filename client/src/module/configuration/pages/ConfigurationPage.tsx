import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import {
  fetchAllTMDBConfiguration,
  clearTMDBConfig,
} from "../store/configurationSlice";
import { OverviewSection } from "../components/OverviewSection";
import { ImagesSection } from "../components/ImagesSection";
import { CountriesSection } from "../components/CountriesSection";
import { JobsSection } from "../components/JobsSection";
import { LanguagesSection } from "../components/LanguagesSection";
import { TimezonesSection } from "../components/TimezonesSection";

type ConfigTab =
  | "overview"
  | "images"
  | "countries"
  | "jobs"
  | "languages"
  | "timezones";

const ConfigurationPage = () => {
  const dispatch = useAppDispatch();
  const {
    configuration,
    countries,
    jobs,
    languages,
    primaryTranslations,
    timezones,
    loading,
    error,
  } = useAppSelector((state) => state.tmdbConfig);

  const [activeTab, setActiveTab] = useState<ConfigTab>("overview");

  useEffect(() => {
    dispatch(fetchAllTMDBConfiguration());

    return () => {
      dispatch(clearTMDBConfig());
    };
  }, [dispatch]);

  const totals = useMemo(
    () => ({
      countries: countries.length,
      jobsDepartments: jobs.length,
      languages: languages.length,
      primaryTranslations: primaryTranslations.length,
      timezones: timezones.length,
    }),
    [countries, jobs, languages, primaryTranslations, timezones]
  );

  const tabs: { key: ConfigTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "images", label: "Images" },
    { key: "countries", label: "Countries" },
    { key: "jobs", label: "Jobs" },
    { key: "languages", label: "Languages" },
    { key: "timezones", label: "Timezones" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            TMDB Configuration
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Cấu hình toàn hệ thống lấy trực tiếp từ The Movie Database.
          </p>
        </div>

        {configuration && (
          <div className="text-xs sm:text-right text-slate-600 dark:text-slate-400">
            <div>
              <span className="font-medium">Base URL:</span>{" "}
              {configuration.images.secure_base_url}
            </div>
            <div>
              <span className="font-medium">Change keys:</span>{" "}
              {configuration.change_keys.length}
            </div>
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={
                  "px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition border " +
                  (active
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                    : "bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="h-4 w-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            Đang tải TMDB configuration…
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-600/40 mb-3">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === "overview" && (
              <OverviewSection configuration={configuration} totals={totals} />
            )}
            {activeTab === "images" && configuration && (
              <ImagesSection images={configuration.images} />
            )}
            {activeTab === "countries" && (
              <CountriesSection countries={countries} />
            )}
            {activeTab === "jobs" && <JobsSection jobs={jobs} />}
            {activeTab === "languages" && (
              <LanguagesSection
                languages={languages}
                primaryTranslations={primaryTranslations}
              />
            )}
            {activeTab === "timezones" && (
              <TimezonesSection timezones={timezones} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPage;
