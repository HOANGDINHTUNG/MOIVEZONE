// src/module/companies/components/CompanyHero.tsx

import type { TMDBCompanyDetailsResponse } from "../database/interface/company";

interface CompanyHeroProps {
  company: TMDBCompanyDetailsResponse;
  imageBaseUrl: string;
}

const CompanyHero = ({ company, imageBaseUrl }: CompanyHeroProps) => {
  const {
    name,
    logo_path,
    origin_country,
    description,
    headquarters,
    homepage,
    parent_company,
  } = company;

  return (
    <section
      className="
        relative rounded-2xl overflow-hidden
        bg-white dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-100
        border border-neutral-200 dark:border-neutral-800
      "
    >
      <div className="px-4 py-6 md:px-8 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
        {/* Logo */}
        <div className="shrink-0">
          <div
            className="
              w-32 h-32 md:w-40 md:h-40 rounded-2xl
              bg-neutral-100 dark:bg-neutral-800
              flex items-center justify-center
              border border-neutral-200 dark:border-neutral-700
              overflow-hidden
            "
          >
            {logo_path ? (
              <img
                src={imageBaseUrl + logo_path}
                alt={name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 text-center px-2">
                No Logo
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Production Company
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">{name}</h2>
          </div>

          <div className="flex flex-wrap gap-3 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            {origin_country && (
              <span className="px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800">
                Quốc gia: {origin_country}
              </span>
            )}
            {headquarters && (
              <span className="px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800">
                Trụ sở: {headquarters}
              </span>
            )}
            {parent_company && (
              <span className="px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800">
                Công ty mẹ: {parent_company}
              </span>
            )}
          </div>

          {description && (
            <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-300">
              {description}
            </p>
          )}

          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex items-center gap-2 text-xs md:text-sm
                text-blue-600 dark:text-blue-400 hover:underline
              "
            >
              🌐 Website chính thức
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default CompanyHero;
