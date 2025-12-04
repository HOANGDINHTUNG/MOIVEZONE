// src/module/person/components/PersonCard.tsx
import { Link } from "react-router-dom";
import type {
  TMDBPersonSummary,
  TMDBPersonCreditMedia,
  TMDBPersonMovieCredit,
  TMDBPersonTvCredit,
} from "../database/interface/person";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface PersonCardProps {
  person: TMDBPersonSummary;
}

const genderLabel: Record<number, string> = {
  0: "Unknown",
  1: "Female",
  2: "Male",
  3: "Non-binary",
};

// Helpers xác định media type
function isMovie(item: TMDBPersonCreditMedia): item is TMDBPersonMovieCredit {
  return item.media_type === "movie";
}
function isTv(item: TMDBPersonCreditMedia): item is TMDBPersonTvCredit {
  return item.media_type === "tv";
}

const PersonCard = ({ person }: PersonCardProps) => {
  const profileUrl = person.profile_path
    ? `${IMAGE_BASE}/w342${person.profile_path}`
    : null;

  const topKnownFor: TMDBPersonCreditMedia[] = (person.known_for || []).slice(
    0,
    3
  );

  // Lấy title từ movie hoặc tv đúng type
  const getTitle = (item: TMDBPersonCreditMedia): string => {
    if (isMovie(item)) return item.title || item.original_title;
    if (isTv(item)) return item.name || item.original_name;
    return "Untitled";
  };

  return (
    <Link
      to={`/person/${person.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/80 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:bg-neutral-900"
    >
      {/* Avatar */}
      <div className="relative h-56 w-full overflow-hidden md:h-64">
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={person.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-xs text-neutral-500">
            No Image
          </div>
        )}

        {/* Overlay gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-neutral-950/95 via-neutral-950/60 to-transparent" />

        {/* Badge popularity */}
        <div className="absolute left-2 top-2 flex flex-col gap-1 text-[10px]">
          <span className="rounded-full bg-neutral-950/80 px-2 py-1 text-[10px] text-neutral-100">
            Pop {person.popularity.toFixed(0)}
          </span>
          <span className="rounded-full bg-amber-500/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-amber-950">
            {person.known_for_department || "Talent"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2.5 text-xs text-neutral-200">
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className="truncate text-sm font-semibold text-neutral-50 md:text-base"
            title={person.name}
          >
            {person.name}
          </h3>
          <span className="shrink-0 rounded-full bg-neutral-800/80 px-2 py-0.5 text-[10px] text-neutral-300">
            {genderLabel[person.gender] ?? "Unknown"}
          </span>
        </div>

        {/* Known for list */}
        {topKnownFor.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-neutral-400">
              Known for
            </p>
            <div className="flex flex-wrap gap-1.5">
              {topKnownFor.map((item) => (
                <span
                  key={`${item.media_type}-${item.id}`}
                  className="max-w-40 truncate rounded-full bg-neutral-800/80 px-2 py-0.5 text-[10px] text-neutral-200"
                >
                  {getTitle(item)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PersonCard;
