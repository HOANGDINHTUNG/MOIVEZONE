import React from "react";
import moment from "moment";
import type { TMDBMovieAccountStatesResponse } from "../database/interface/movie";
import type { TMDBTvAccountStatesResponse } from "../database/interface/tv";

type MediaFacts = {
  status?: string;
  originalLanguage?: string;
  spokenLanguages?: string[];
  productionCountries?: string[];
  budget?: number | null;
  revenue?: number | null;
  inProduction?: boolean;
  numberOfSeasons?: number | null;
  numberOfEpisodes?: number | null;
  lastAirDate?: string | null;
  nextEpisodeName?: string | null;
};

type MediaAccountStates =
  | TMDBMovieAccountStatesResponse
  | TMDBTvAccountStatesResponse
  | undefined;

interface DetailsFactsSectionProps {
  facts: MediaFacts;
  ageRating: string;
  homepage?: string;
  resolvedMediaType: "movie" | "tv";
  accountStates?: MediaAccountStates;
}

const currencyFormat = (value?: number | null) => {
  if (!value || value <= 0) return null;
  return `$${value.toLocaleString("en-US")}`;
};

const DetailsFactsSection: React.FC<DetailsFactsSectionProps> = ({
  facts,
  ageRating,
  homepage,
  resolvedMediaType,
  accountStates,
}) => {
  const {
    status,
    originalLanguage,
    spokenLanguages,
    productionCountries,
    budget,
    revenue,
    inProduction,
    numberOfSeasons,
    numberOfEpisodes,
    lastAirDate,
    nextEpisodeName,
  } = facts;

  const movieFinancial =
    resolvedMediaType === "movie" &&
    (currencyFormat(budget) || currencyFormat(revenue));

  const tvCounts =
    resolvedMediaType === "tv" &&
    (numberOfEpisodes || numberOfSeasons || lastAirDate);

  const userRated =
    accountStates && "rated" in accountStates && accountStates.rated;

  return (
    <section aria-label="Facts" className="rounded-xl bg-neutral-900/60 p-4">
      <h2 className="mb-3 border-b border-neutral-800 pb-2 text-sm font-semibold uppercase tracking-wide text-neutral-200">
        Facts
      </h2>

      <div className="space-y-2 text-xs text-neutral-300">
        {ageRating && (
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Certification</span>
            <span className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-900">
              {ageRating}
            </span>
          </div>
        )}

        {status && (
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Status</span>
            <span className="font-medium">{status}</span>
          </div>
        )}

        {originalLanguage && (
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Original language</span>
            <span className="uppercase">{originalLanguage}</span>
          </div>
        )}

        {spokenLanguages && spokenLanguages.length > 0 && (
          <div>
            <span className="text-neutral-400">Spoken languages</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {spokenLanguages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full bg-neutral-800 px-2 py-0.5 text-[11px]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {productionCountries && productionCountries.length > 0 && (
          <div>
            <span className="text-neutral-400">Production countries</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {productionCountries.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-neutral-800 px-2 py-0.5 text-[11px]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {movieFinancial && (
          <div className="mt-2 space-y-1">
            {currencyFormat(budget) && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Budget</span>
                <span className="font-medium">{currencyFormat(budget)}</span>
              </div>
            )}
            {currencyFormat(revenue) && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Revenue</span>
                <span className="font-medium">{currencyFormat(revenue)}</span>
              </div>
            )}
          </div>
        )}

        {tvCounts && (
          <div className="mt-2 space-y-1">
            {typeof numberOfSeasons === "number" && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Seasons</span>
                <span className="font-medium">{numberOfSeasons}</span>
              </div>
            )}
            {typeof numberOfEpisodes === "number" && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Episodes</span>
                <span className="font-medium">{numberOfEpisodes}</span>
              </div>
            )}
            {lastAirDate && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Last air date</span>
                <span className="font-medium">
                  {moment(lastAirDate).format("MMM Do YYYY")}
                </span>
              </div>
            )}
            {typeof inProduction === "boolean" && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">In production</span>
                <span className="font-medium">
                  {inProduction ? "Yes" : "No"}
                </span>
              </div>
            )}
            {nextEpisodeName && (
              <div>
                <span className="text-neutral-400">Next episode</span>
                <p className="mt-0.5 text-[11px] text-neutral-200">
                  {nextEpisodeName}
                </p>
              </div>
            )}
          </div>
        )}

        {userRated && typeof userRated === "object" && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-neutral-400">Your rating</span>
            <span className="rounded-full bg-yellow-500/90 px-2 py-0.5 text-[11px] font-semibold text-neutral-900">
              ★ {userRated.value}
            </span>
          </div>
        )}

        {homepage && (
          <div className="mt-3">
            <a
              href={homepage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-900 hover:bg-white"
            >
              Official site
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailsFactsSection;
