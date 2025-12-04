import type { TMDBLatestPersonResponse } from "../database/interface/person";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface PersonLatestCardProps {
  latest?: TMDBLatestPersonResponse | null;
}

const PersonLatestCard = ({ latest }: PersonLatestCardProps) => {
  if (!latest) return null;

  return (
    <section className="rounded-xl border border-neutral-800 bg-linear-to-r from-neutral-900/80 via-neutral-900/60 to-neutral-900/80 p-4 text-sm text-neutral-200">
      <p className="text-xs uppercase tracking-wide text-amber-300">
        TMDB Latest Person
      </p>
      <div className="mt-2 flex items-center gap-3">
        {latest.profile_path && (
          <img
            src={`${IMAGE_BASE}/w185${latest.profile_path}`}
            alt={latest.name}
            className="h-16 w-16 rounded-lg object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-neutral-50">{latest.name}</p>
          <p className="text-xs text-neutral-400">
            {latest.known_for_department}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PersonLatestCard;
