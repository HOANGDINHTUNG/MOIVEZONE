import { useMemo } from "react";
import type {
  TMDBPersonCombinedCredits,
  TMDBPersonCastCombined,
} from "../database/interface/person";
import Card from "./Card";

interface PersonKnownForProps {
  combinedCredits?: TMDBPersonCombinedCredits;
}

const PersonKnownFor = ({ combinedCredits }: PersonKnownForProps) => {
  const knownForList: TMDBPersonCastCombined[] = useMemo(() => {
    if (!combinedCredits) return [];
    const uniqueMap = new Map<number, TMDBPersonCastCombined>();
    combinedCredits.cast.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      } else {
        const old = uniqueMap.get(item.id)!;
        if (item.popularity > old.popularity) uniqueMap.set(item.id, item);
      }
    });
    return [...uniqueMap.values()]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);
  }, [combinedCredits]);

  return (
    <section id="known-for" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight md:text-2xl">
          Known For
        </h2>
        {knownForList.length > 0 && (
          <span className="text-xs text-neutral-400">
            Top {knownForList.length} theo độ phổ biến
          </span>
        )}
      </div>

      {knownForList.length ? (
        <div className="-mx-4 overflow-x-auto pb-2">
          <div className="flex gap-4 px-4">
            {knownForList.map((item) => (
              <div key={`${item.media_type}-${item.id}-${item.credit_id}`}>
                <Card data={item} media_type={item.media_type} />
                <p className="mt-1 max-w-40 truncate text-xs text-neutral-300">
                  as{" "}
                  <span className="font-medium text-neutral-50">
                    {item.character || "Unknown"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-neutral-400">Chưa có dữ liệu Known For.</p>
      )}
    </section>
  );
};

export default PersonKnownFor;
