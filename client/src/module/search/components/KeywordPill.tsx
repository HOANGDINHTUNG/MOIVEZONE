import type { TMDBSearchKeywordItem } from "../database/interface/search";

interface KeywordPillProps {
  item: TMDBSearchKeywordItem;
}

export default function KeywordPill({ item }: KeywordPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-neutral-900/80 px-3 py-1 text-xs text-emerald-300 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span className="font-medium">{item.name}</span>
      <span className="text-[10px] text-neutral-400">#{item.id}</span>
    </div>
  );
}
