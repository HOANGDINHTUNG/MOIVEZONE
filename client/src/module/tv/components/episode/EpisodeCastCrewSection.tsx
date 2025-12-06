import type { TMDBTvEpisodeCast, TMDBTvEpisodeCreditsCrew, TMDBTvEpisodeGuestStars } from "../../database/interface/tv_episode";

interface EpisodeCastCrewSectionProps {
  cast: TMDBTvEpisodeCast[];
  crew: TMDBTvEpisodeCreditsCrew[];
  guestStars: TMDBTvEpisodeGuestStars[];
}

const profileBase = "https://image.tmdb.org/t/p/w185";

const EpisodeCastCrewSection = ({
  cast,
  crew,
  guestStars,
}: EpisodeCastCrewSectionProps) => {
  const topCast = cast.slice(0, 10);
  const topCrew = crew.slice(0, 8);
  const topGuests = guestStars.slice(0, 8);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Cast & Crew
        </p>
        <p className="text-[11px] text-slate-500">
          Cast {cast.length} · Crew {crew.length} · Guest {guestStars.length}
        </p>
      </div>

      {/* Cast */}
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-300">Main Cast</p>
        {topCast.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {topCast.map((p) => (
              <div
                key={p.credit_id}
                className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-2"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  {p.profile_path ? (
                    <img
                      src={`${profileBase}${p.profile_path}`}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-500">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-50">
                    {p.name}
                  </p>
                  <p className="line-clamp-2 text-[10px] text-slate-300">
                    {p.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">No cast data.</p>
        )}
      </div>

      {/* Crew */}
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-300">Key Crew</p>
        {topCrew.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {topCrew.map((p) => (
              <div
                key={p.credit_id}
                className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-2"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  {p.profile_path ? (
                    <img
                      src={`${profileBase}${p.profile_path}`}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-500">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-50">
                    {p.name}
                  </p>
                  <p className="line-clamp-2 text-[10px] text-slate-300">
                    {p.job} · {p.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">No crew data.</p>
        )}
      </div>

      {/* Guest stars */}
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-300">Guest Stars</p>
        {topGuests.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {topGuests.map((p) => (
              <div
                key={p.credit_id}
                className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-2"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  {p.profile_path ? (
                    <img
                      src={`${profileBase}${p.profile_path}`}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-500">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-50">
                    {p.name}
                  </p>
                  <p className="line-clamp-2 text-[10px] text-slate-300">
                    {p.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">No guest stars data.</p>
        )}
      </div>
    </div>
  );
};

export default EpisodeCastCrewSection;
