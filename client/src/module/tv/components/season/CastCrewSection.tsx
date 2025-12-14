import type {
  TMDBTvSeasonAggregateCast,
  TMDBTvSeasonAggregateCrew,
} from "../../database/interface/tv_season";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface CastCrewProps {
  cast: TMDBTvSeasonAggregateCast[];
  crew: TMDBTvSeasonAggregateCrew[];
}

const CastCrewSection = ({ cast, crew }: CastCrewProps) => {
  const topCast = cast.slice(0, 12);
  const topCrew = crew.slice(0, 8);

  return (
    <div
      className="
        rounded-2xl border border-white/10 
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 md:p-5 backdrop-blur-xl shadow-2xl
      "
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Cast &amp; Crew
        </p>
        <p className="text-[11px] text-slate-300">
          Cast {cast.length} · Crew {crew.length}
        </p>
      </div>

      <div className="space-y-5">
        {/* Cast */}
        <div>
          <p className="mb-2 text-xs font-semibold text-violet-200">
            Main Cast
          </p>

          {topCast.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {topCast.map((person) => {
                const profile = person.profile_path
                  ? `${IMAGE_BASE}/w185${person.profile_path}`
                  : null;

                const roles = person.roles.slice(0, 2);
                const mainRole = person.roles[0];

                return (
                  <div
                    key={`${person.id}-${mainRole?.credit_id ?? "no-role"}`}
                    className="
                      flex gap-2 rounded-xl border border-white/10 
                      bg-white/5 p-2
                      transition-transform duration-200
                      hover:-translate-y-0.5 hover:border-fuchsia-500/70 hover:bg-fuchsia-500/10
                    "
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-900/80">
                      {profile ? (
                        <img
                          src={profile}
                          alt={person.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-50">
                        {person.name}
                      </p>
                      <p className="line-clamp-2 text-[10px] text-slate-200/90">
                        {roles.map((r) => r.character).join(", ")}
                        {person.total_episode_count
                          ? ` · ${person.total_episode_count} eps`
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400">No cast data.</p>
          )}
        </div>

        {/* Crew */}
        <div>
          <p className="mb-2 text-xs font-semibold text-cyan-200">
            Key Crew
          </p>

          {topCrew.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {topCrew.map((person) => {
                const profile = person.profile_path
                  ? `${IMAGE_BASE}/w185${person.profile_path}`
                  : null;

                const jobs = person.jobs.slice(0, 2);

                return (
                  <div
                    key={`${person.id}-${person.department}`}
                    className="
                      flex gap-2 rounded-xl border border-white/10 
                      bg-white/5 p-2
                      transition-transform duration-200
                      hover:-translate-y-0.5 hover:border-cyan-400/70 hover:bg-cyan-500/10
                    "
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-900/80">
                      {profile ? (
                        <img
                          src={profile}
                          alt={person.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-50">
                        {person.name}
                      </p>
                      <p className="line-clamp-2 text-[10px] text-slate-200/90">
                        {jobs.map((j) => j.job).join(", ")}
                        {person.total_episode_count
                          ? ` · ${person.total_episode_count} eps`
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400">No crew data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CastCrewSection;
