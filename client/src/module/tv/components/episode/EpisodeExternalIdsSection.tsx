import type { TMDBTvEpisodeExternalIds } from "../../database/interface/tv_episode";

interface EpisodeExternalIdsSectionProps {
  externalIds: TMDBTvEpisodeExternalIds | null;
}

const EpisodeExternalIdsSection = ({
  externalIds,
}: EpisodeExternalIdsSectionProps) => {
  if (!externalIds) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          External IDs
        </p>
        <p className="text-[11px] text-slate-400">No external IDs.</p>
      </div>
    );
  }

  const items: {
    label: string;
    value: string | number | null;
    url?: string;
  }[] = [
    {
      label: "IMDb",
      value: externalIds.imdb_id,
      url: externalIds.imdb_id
        ? `https://www.imdb.com/title/${externalIds.imdb_id}`
        : undefined,
    },
    {
      label: "TVDB",
      value: externalIds.tvdb_id,
      url: externalIds.tvdb_id
        ? `https://thetvdb.com/?id=${externalIds.tvdb_id}&tab=series`
        : undefined,
    },
    {
      label: "Wikidata",
      value: externalIds.wikidata_id,
      url: externalIds.wikidata_id
        ? `https://www.wikidata.org/wiki/${externalIds.wikidata_id}`
        : undefined,
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
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          External IDs
        </p>
        <p className="text-[11px] text-slate-400">No external IDs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">
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
                className="text-[11px] rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 transition-colors hover:border-sky-400 hover:text-sky-200"
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

export default EpisodeExternalIdsSection;
