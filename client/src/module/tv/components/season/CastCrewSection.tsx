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
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Cast & Crew
        </p>
        <p className="text-[11px] text-slate-500">
          Cast {cast.length} · Crew {crew.length}
        </p>
      </div>

      <div className="space-y-4">
        {/* Cast */}
        <div>
          <p className="text-xs font-semibold text-slate-300 mb-2">Main Cast</p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {topCast.map((person) => {
              const profile = person.profile_path
                ? `${IMAGE_BASE}/w185${person.profile_path}`
                : null;

              const roles = person.roles.slice(0, 2);
              const mainRole = person.roles[0];

              return (
                <div
                  key={`${person.id}-${mainRole?.credit_id ?? "no-role"}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 flex gap-2"
                >
                  <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                    {profile ? (
                      <img
                        src={profile}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-50 truncate">
                      {person.name}
                    </p>
                    <p className="text-[10px] text-slate-300 line-clamp-2">
                      {roles.map((r) => r.character).join(", ")}
                      {person.total_episode_count
                        ? ` · ${person.total_episode_count} eps`
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })}
            {!topCast.length && (
              <p className="text-[11px] text-slate-400">No cast data.</p>
            )}
          </div>
        </div>

        {/* Crew */}
        <div>
          <p className="text-xs font-semibold text-slate-300 mb-2">Key Crew</p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {topCrew.map((person) => {
              const profile = person.profile_path
                ? `${IMAGE_BASE}/w185${person.profile_path}`
                : null;

              const jobs = person.jobs.slice(0, 2);

              return (
                <div
                  key={`${person.id}-${person.department}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 flex gap-2"
                >
                  <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                    {profile ? (
                      <img
                        src={profile}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-50 truncate">
                      {person.name}
                    </p>
                    <p className="text-[10px] text-slate-300 line-clamp-2">
                      {jobs.map((j) => j.job).join(", ")}
                      {person.total_episode_count
                        ? ` · ${person.total_episode_count} eps`
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })}
            {!topCrew.length && (
              <p className="text-[11px] text-slate-400">No crew data.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastCrewSection;
