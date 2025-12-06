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
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
          External IDs
        </p>
        <p className="text-[11px] text-slate-400">No external IDs.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
      <p className="text-xs uppercase tracking-wide text-slate-400">
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
                className="text-[11px] rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 hover:border-sky-400 hover:text-sky-200 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                key={item.label}
                className="text-[11px] rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1"
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
