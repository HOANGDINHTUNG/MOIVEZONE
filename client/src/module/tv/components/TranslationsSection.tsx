import type { TMDBTvSeasonTranslation } from "../database/interface/tv_season";

interface TranslationsSectionProps {
  translations: TMDBTvSeasonTranslation[];
  currentLanguage: string;
}

const TranslationsSection = ({
  translations,
  currentLanguage,
}: TranslationsSectionProps) => {
  if (!translations.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
          Translations
        </p>
        <p className="text-[11px] text-slate-400">No translations.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
        Translations ({translations.length})
      </p>
      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        <table className="w-full text-left border-separate border-spacing-y-1 text-[11px]">
          <thead>
            <tr className="text-slate-400">
              <th className="font-normal pr-2">Lang</th>
              <th className="font-normal pr-2">Name</th>
              <th className="font-normal">Overview</th>
            </tr>
          </thead>
          <tbody>
            {translations.map((t) => {
              const isCurrent =
                t.iso_639_1 === currentLanguage.split("-")[0].toLowerCase();

              return (
                <tr
                  key={t.iso_639_1 + t.iso_3166_1}
                  className={`${
                    isCurrent
                      ? "bg-slate-900/90 border border-sky-500/40"
                      : "bg-slate-900/70 border border-slate-800"
                  }`}
                >
                  <td className="px-2 py-1 rounded-l-lg align-top">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-100">
                        {t.iso_639_1}-{t.iso_3166_1}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {t.english_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-1 align-top">
                    <span className="text-slate-100">{t.data.name}</span>
                  </td>
                  <td className="px-2 py-1 rounded-r-lg align-top">
                    <p className="text-slate-300 line-clamp-2">
                      {t.data.overview}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TranslationsSection;
