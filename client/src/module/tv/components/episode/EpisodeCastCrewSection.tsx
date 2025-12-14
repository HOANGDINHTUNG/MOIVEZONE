import type {
  TMDBTvEpisodeCast,
  TMDBTvEpisodeCreditsCrew,
  TMDBTvEpisodeGuestStars,
} from "../../database/interface/tv_episode";

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
    <div
      className="
        space-y-5 rounded-2xl border border-white/10 
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 md:p-5 backdrop-blur-xl shadow-2xl
      "
    >
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          Cast &amp; Crew
        </p>
        <p className="text-[11px] text-slate-300">
          Cast {cast.length} · Crew {crew.length} · Guest {guestStars.length}
        </p>
      </div>

      {/* Main Cast */}
      <div>
        <p className="mb-2 text-xs font-semibold text-violet-200">
          Main Cast
        </p>
        {topCast.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {topCast.map((p) => (
              <div
                key={p.credit_id}
                className="
                  flex gap-2 rounded-xl border border-white/10 
                  bg-white/5 p-2
                  transition-colors duration-200
                  hover:-translate-y-0.5 hover:border-fuchsia-500/70 hover:bg-fuchsia-500/10
                "
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-900/80">
                  {p.profile_path ? (
                    <img
                      src={`${profileBase}${p.profile_path}`}
                      alt={p.name}
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
                    {p.name}
                  </p>
                  <p className="line-clamp-2 text-[10px] text-slate-200/90">
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

      {/* Key Crew */}
      <div>
        <p className="mb-2 text-xs font-semibold text-cyan-200">
          Key Crew
        </p>
        {topCrew.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {topCrew.map((p) => (
              <div
                key={p.credit_id}
                className="
                  flex gap-2 rounded-xl border border-white/10 
                  bg-white/5 p-2
                  transition-colors duration-200
                  hover:-translate-y-0.5 hover:border-cyan-400/70 hover:bg-cyan-500/10
                "
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-900/80">
                  {p.profile_path ? (
                    <img
                      src={`${profileBase}${p.profile_path}`}
                      alt={p.name}
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
                    {p.name}
                  </p>
                  <p className="line-clamp-2 text-[10px] text-slate-200/90">
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

      {/* Guest Stars */}
      <div>
        <p className="mb-2 text-xs font-semibold text-rose-200">
          Guest Stars
        </p>
        {topGuests.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {topGuests.map((p) => (
              <div
                key={p.credit_id}
                className="
                  flex gap-2 rounded-xl border border-white/10 
                  bg-white/5 p-2
                  transition-colors duration-200
                  hover:-translate-y-0.5 hover:border-rose-400/70 hover:bg-rose-500/10
                "
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-900/80">
                  {p.profile_path ? (
                    <img
                      src={`${profileBase}${p.profile_path}`}
                      alt={p.name}
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
                    {p.name}
                  </p>
                  <p className="line-clamp-2 text-[10px] text-slate-200/90">
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
