import React from "react";

interface MediaTranslationSummary {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
}

interface DetailsTranslationsSectionProps {
  translations: MediaTranslationSummary[];
}

const DetailsTranslationsSection: React.FC<DetailsTranslationsSectionProps> = ({
  translations,
}) => {
  if (!translations.length) return null;

  const total = translations.length;
  const top = translations.slice(0, 10);

  return (
    <section
      aria-label="Translations"
      className="rounded-xl bg-neutral-900/60 p-4"
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
          Translations
        </h2>
        <span className="text-[11px] text-neutral-400">
          {total} language{total > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {top.map((t) => (
          <span
            key={`${t.iso_3166_1}-${t.iso_639_1}`}
            className="rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-100"
          >
            {t.english_name || t.name}
          </span>
        ))}
        {total > top.length && (
          <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-400">
            +{total - top.length} more
          </span>
        )}
      </div>
    </section>
  );
};

export default DetailsTranslationsSection;
