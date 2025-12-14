import type { TMDBTvEpisodeExternalIds } from "../../database/interface/tv_episode";

interface EpisodeExternalIdsSectionProps {
  externalIds: TMDBTvEpisodeExternalIds | null;
}

const EpisodeExternalIdsSection = ({
  externalIds,
}: EpisodeExternalIdsSectionProps) => {
  if (!externalIds) {
    return (
      <div
        className="
          rounded-2xl border border-white/10 
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          External IDs
        </p>
        <p className="text-[11px] text-slate-300">No external IDs.</p>
      </div>
    );
  }

  const items: {
    label: string;
    value: string | number | null;
    url?: string;
    colorClass?: string;
  }[] = [
    {
      label: "IMDb",
      value: externalIds.imdb_id,
      url: externalIds.imdb_id
        ? `https://www.imdb.com/title/${externalIds.imdb_id}`
        : undefined,
      colorClass:
        "border-amber-400/80 bg-amber-500/15 text-amber-100 hover:bg-amber-400/25 hover:shadow-[0_0_12px_#fbbf2488]",
    },
    {
      label: "TVDB",
      value: externalIds.tvdb_id,
      url: externalIds.tvdb_id
        ? `https://thetvdb.com/?id=${externalIds.tvdb_id}&tab=series`
        : undefined,
      colorClass:
        "border-cyan-400/80 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-400/25 hover:shadow-[0_0_12px_#22d3ee88]",
    },
    {
      label: "Wikidata",
      value: externalIds.wikidata_id,
      url: externalIds.wikidata_id
        ? `https://www.wikidata.org/wiki/${externalIds.wikidata_id}`
        : undefined,
      colorClass:
        "border-violet-400/80 bg-violet-500/15 text-violet-100 hover:bg-violet-400/25 hover:shadow-[0_0_12px_#a855f788]",
    },
    {
      label: "Freebase MID",
      value: externalIds.freebase_mid,
    },
    {
      label: "Freebase ID",
      value: externalIds.freebase_id,
    },
    {
      label: "TVRage",
      value: externalIds.tvrage_id,
    },
  ];

  const hasAny = items.some((i) => i.value);

  if (!hasAny) {
    return (
      <div
        className="
          rounded-2xl border border-white/10 
          bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
          p-4 backdrop-blur-md shadow-xl
        "
      >
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
          External IDs
        </p>
        <p className="text-[11px] text-slate-300">No external IDs.</p>
      </div>
    );
  }

  return (
    <div
      className="
        space-y-2 rounded-2xl border border-white/10 
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 backdrop-blur-md shadow-xl
      "
    >
      <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
        External IDs
      </p>

      <div className="flex flex-wrap gap-2">
        {items.map((item) =>
          item.value ? (
            item.url ? (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className={`
                  text-[11px] rounded-full border px-3 py-1 
                  transition-shadow duration-200
                  ${item.colorClass ??
                    "border-slate-400/60 bg-slate-700/40 text-slate-100 hover:bg-slate-500/50 hover:shadow-[0_0_10px_#94a3b899]"}
                `}
              >
                {item.label}
              </a>
            ) : (
              <span
                key={item.label}
                className="
                  text-[11px] rounded-full border border-slate-500/60 
                  bg-slate-800/60 px-3 py-1 text-slate-100
                "
              >
                {item.label}
              </span>
            )
          ) : null
        )}
      </div>
    </div>
  );
};

export default EpisodeExternalIdsSection;
