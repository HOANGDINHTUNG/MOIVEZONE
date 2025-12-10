import type { TMDBTvSeasonExternalIds } from "../../database/interface/tv_season";

interface ExternalIdsSectionProps {
  external: TMDBTvSeasonExternalIds | null;
}

const ExternalIdsSection = ({ external }: ExternalIdsSectionProps) => {
  if (!external) return null;

  const links: {
    label: string;
    value: string | number | null;
    url?: string;
  }[] = [
    {
      label: "TVDB",
      value: external.tvdb_id,
      url: external.tvdb_id
        ? `https://thetvdb.com/?id=${external.tvdb_id}&tab=series`
        : undefined,
    },
    {
      label: "Wikidata",
      value: external.wikidata_id,
      url: external.wikidata_id
        ? `https://www.wikidata.org/wiki/${external.wikidata_id}`
        : undefined,
    },
    {
      label: "Freebase MID",
      value: external.freebase_mid,
    },
    {
      label: "Freebase ID",
      value: external.freebase_id,
    },
    {
      label: "TVRage",
      value: external.tvrage_id,
    },
  ];

  const hasAny = links.some((l) => l.value);

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
        rounded-2xl border border-white/10 
        bg-linear-to-br from-[#050816]/90 via-[#020617]/90 to-black/90
        p-4 space-y-2 backdrop-blur-md shadow-2xl
      "
    >
      <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80">
        External IDs
      </p>

      <div className="flex flex-wrap gap-2">
        {links.map((item) =>
          item.value ? (
            item.url ? (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="
                  text-[11px] rounded-full px-3 py-1
                  border border-white/10 bg-white/5
                  hover:border-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-200
                  transition-transform duration-200
                  hover:-translate-y-0.5
                "
              >
                {item.label}
              </a>
            ) : (
              <span
                key={item.label}
                className="
                  text-[11px] rounded-full px-3 py-1
                  border border-white/10 bg-white/5 text-slate-200
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

export default ExternalIdsSection;
