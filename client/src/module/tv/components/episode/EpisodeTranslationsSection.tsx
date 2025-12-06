import type { TMDBTvEpisodeTranslations } from "../../database/interface/tv_episode";

interface EpisodeTranslationsSectionProps {
  translations: TMDBTvEpisodeTranslations | null;
  currentLanguage: string;
}

const EpisodeTranslationsSection = ({
  translations,
  currentLanguage,
}: EpisodeTranslationsSectionProps) => {
  const items = translations?.translations ?? [];

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          Translations
        </p>
        <p className="text-[11px] text-slate-400">No translations.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
        Translations ({items.length})
      </p>
      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        <table className="w-full border-separate border-spacing-y-1 text-left text-[11px]">
          <thead>
            <tr className="text-slate-400">
              <th className="pr-2 font-normal">Lang</th>
              <th className="pr-2 font-normal">Name</th>
              <th className="font-normal">Overview</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => {
              const isCurrent =
                t.iso_639_1 === currentLanguage.split("-")[0].toLowerCase();

              return (
                <tr
                  key={t.iso_639_1 + t.iso_3166_1}
                  className={`${
                    isCurrent
                      ? "border border-sky-500/40 bg-slate-900/90"
                      : "border border-slate-800 bg-slate-900/70"
                  }`}
                >
                  <td className="rounded-l-lg px-2 py-1 align-top">
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
                  <td className="rounded-r-lg px-2 py-1 align-top">
                    <p className="line-clamp-2 text-slate-300">
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

export default EpisodeTranslationsSection;
