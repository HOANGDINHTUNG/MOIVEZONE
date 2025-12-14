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
      <div
        className="
          rounded-2xl border border-white/10 
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Translations
        </p>
        <p className="text-[11px] text-slate-300">No translations.</p>
      </div>
    );
  }

  return (
    <div
      className="
        rounded-2xl border border-white/10 
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 backdrop-blur-md shadow-2xl
      "
    >
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
        Translations ({items.length})
      </p>

      <div
        className="
          max-h-64 overflow-y-auto 
          scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-slate-900
        "
      >
        <table className="w-full border-separate border-spacing-y-1 text-left text-[11px]">
          <thead>
            <tr className="text-slate-300">
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
                  className={`
                    ${
                      isCurrent
                        ? "border border-fuchsia-500/60 bg-linear-to-r from-fuchsia-700/40 via-violet-700/40 to-cyan-600/30 shadow-[0_0_14px_#e879f955]"
                        : "border border-white/10 bg-white/5"
                    }
                  `}
                >
                  <td className="rounded-l-lg px-2 py-1 align-top">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-50">
                        {t.iso_639_1}-{t.iso_3166_1}
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {t.english_name}
                      </span>
                    </div>
                  </td>

                  <td className="px-2 py-1 align-top">
                    <span className="text-slate-100">
                      {t.data.name || <span className="text-slate-500">—</span>}
                    </span>
                  </td>

                  <td className="rounded-r-lg px-2 py-1 align-top">
                    <p className="line-clamp-2 text-slate-200/90">
                      {t.data.overview || (
                        <span className="text-slate-500">No overview</span>
                      )}
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
