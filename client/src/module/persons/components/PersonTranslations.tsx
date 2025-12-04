import type { TMDBPersonTranslationsResponse } from "../database/interface/person";

interface PersonTranslationsProps {
  translations?: TMDBPersonTranslationsResponse;
}

const PersonTranslations = ({ translations }: PersonTranslationsProps) => {
  return (
    <section id="translations" className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight md:text-2xl">
          Translations
        </h2>
        <span className="text-xs text-neutral-400">
          Tổng: {translations?.translations.length ?? 0}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/60">
        {translations?.translations.length ? (
          <table className="min-w-full text-left text-xs text-neutral-200">
            <thead className="border-b border-neutral-800 bg-neutral-900/80 uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-2">Locale</th>
                <th className="px-4 py-2">English Name</th>
                <th className="px-4 py-2">Local Name</th>
              </tr>
            </thead>
            <tbody>
              {translations.translations.map((t) => (
                <tr
                  key={`${t.iso_639_1}-${t.iso_3166_1}`}
                  className="border-b border-neutral-800/80 last:border-none"
                >
                  <td className="px-4 py-2 text-neutral-400">
                    {t.iso_639_1}-{t.iso_3166_1}
                  </td>
                  <td className="px-4 py-2">{t.english_name}</td>
                  <td className="px-4 py-2">{t.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-sm text-neutral-400">
            Không có translation data.
          </p>
        )}
      </div>
    </section>
  );
};

export default PersonTranslations;
