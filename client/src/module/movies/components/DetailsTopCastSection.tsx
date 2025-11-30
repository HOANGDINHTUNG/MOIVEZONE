// src/pages/DetailsTopCastSection.tsx
import { Link } from "react-router-dom";
import Divider from "../../../components/common/ux/Divider";

type CastItem = {
  cast_id?: number;
  credit_id?: string;
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
};

type DetailsTopCastSectionProps = {
  starCast: CastItem[];
  imageURL: string;
};

const DetailsTopCastSection: React.FC<DetailsTopCastSectionProps> = ({
  starCast,
  imageURL,
}) => {
  if (!starCast.length) return null;

  return (
    <>
      <Divider />
      <div className="mt-4">
        <h2 className="font-semibold mb-2 text-sm md:text-base">Top Cast</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {starCast.map((cast) => (
            <Link
              key={cast.cast_id ?? `${cast.credit_id}-${cast.id}`}
              to={
                cast.credit_id
                  ? `/credits/${cast.credit_id}`
                  : `/person/${cast.id}`
              }
              className="w-24 shrink-0 group"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-800 mb-1 group-hover:ring-2 group-hover:ring-red-500/70 transition">
                {cast.profile_path ? (
                  <img
                    src={imageURL + cast.profile_path}
                    alt={cast.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                    No Image
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold line-clamp-2 group-hover:text-red-400">
                {cast.name}
              </p>
              <p className="text-[11px] text-neutral-400 line-clamp-1">
                {cast.character}
              </p>
              {cast.credit_id && (
                <span className="mt-0.5 inline-flex items-center rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 group-hover:bg-red-600 group-hover:text-white">
                  View credit
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default DetailsTopCastSection;
