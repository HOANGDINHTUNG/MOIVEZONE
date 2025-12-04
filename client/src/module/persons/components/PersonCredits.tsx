import { useMemo } from "react";
import type {
  TMDBPersonMovieCredits,
  TMDBPersonTvCredits,
} from "../database/interface/person";

interface PersonCreditsProps {
  movieCredits?: TMDBPersonMovieCredits;
  tvCredits?: TMDBPersonTvCredits;
}

const PersonCredits = ({ movieCredits, tvCredits }: PersonCreditsProps) => {
  const sortedMovieCast = useMemo(
    () =>
      movieCredits?.cast
        ? [...movieCredits.cast].sort((a, b) =>
            (b.release_date || "").localeCompare(a.release_date || "")
          )
        : [],
    [movieCredits]
  );

  const sortedTvCast = useMemo(
    () =>
      tvCredits?.cast
        ? [...tvCredits.cast].sort((a, b) =>
            (b.first_air_date || "").localeCompare(a.first_air_date || "")
          )
        : [],
    [tvCredits]
  );

  return (
    <section id="credits" className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight md:text-2xl">
          Credits
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Movie Cast */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
            Movie Cast ({movieCredits?.cast.length ?? 0})
          </h3>
          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1 text-sm scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
            {sortedMovieCast.length ? (
              sortedMovieCast.map((c) => (
                <div
                  key={c.credit_id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-neutral-900/80 px-3 py-2 hover:bg-neutral-800/80"
                >
                  <div className="min-w-0">
                    <p className="truncate text-neutral-50">
                      {c.title || c.original_title}
                    </p>
                    <p className="truncate text-xs text-neutral-400">
                      as{" "}
                      <span className="text-neutral-100">
                        {c.character || "Unknown"}
                      </span>
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-neutral-500">
                    {c.release_date?.slice(0, 4) || "----"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400">Không có movie cast.</p>
            )}
          </div>
        </div>

        {/* TV Cast */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
            TV Cast ({tvCredits?.cast.length ?? 0})
          </h3>
          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1 text-sm scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
            {sortedTvCast.length ? (
              sortedTvCast.map((c) => (
                <div
                  key={c.credit_id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-neutral-900/80 px-3 py-2 hover:bg-neutral-800/80"
                >
                  <div className="min-w-0">
                    <p className="truncate text-neutral-50">
                      {c.name || c.original_name}
                    </p>
                    <p className="truncate text-xs text-neutral-400">
                      as{" "}
                      <span className="text-neutral-100">
                        {c.character || "Unknown"}
                      </span>{" "}
                      · {c.episode_count} ep
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-neutral-500">
                    {c.first_air_date?.slice(0, 4) || "----"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400">Không có TV cast.</p>
            )}
          </div>
        </div>

        {/* Movie Crew */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
            Movie Crew ({movieCredits?.crew.length ?? 0})
          </h3>
          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1 text-sm scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
            {movieCredits?.crew.length ? (
              movieCredits.crew.map((c) => (
                <div
                  key={c.credit_id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-neutral-900/80 px-3 py-2 hover:bg-neutral-800/80"
                >
                  <div className="min-w-0">
                    <p className="truncate text-neutral-50">
                      {c.title || c.original_title}
                    </p>
                    <p className="truncate text-xs text-neutral-400">
                      {c.department} ·{" "}
                      <span className="text-neutral-100">{c.job}</span>
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-neutral-500">
                    {c.release_date?.slice(0, 4) || "----"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400">Không có movie crew.</p>
            )}
          </div>
        </div>

        {/* TV Crew */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
            TV Crew ({tvCredits?.crew.length ?? 0})
          </h3>
          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1 text-sm scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
            {tvCredits?.crew.length ? (
              tvCredits.crew.map((c) => (
                <div
                  key={c.credit_id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-neutral-900/80 px-3 py-2 hover:bg-neutral-800/80"
                >
                  <div className="min-w-0">
                    <p className="truncate text-neutral-50">
                      {c.name || c.original_name}
                    </p>
                    <p className="truncate text-xs text-neutral-400">
                      {c.department} ·{" "}
                      <span className="text-neutral-100">{c.job}</span> ·{" "}
                      {c.episode_count} ep
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-neutral-500">
                    {c.first_air_date?.slice(0, 4) || "----"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400">Không có TV crew.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonCredits;
