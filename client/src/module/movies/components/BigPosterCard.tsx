import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";

interface BigPosterCardProps {
  posterPath: string | null;
  logoPath?: string | null;
  title: string;

  topText?: string;

  runtimeMinutes?: number;
  seasonCount?: number;

  genreLabel?: string;

  detailPath: string;
}

const formatRuntime = (mins?: number) => {
  if (!mins || mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m}min`;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
};

const BigPosterCard = ({
  posterPath,
  logoPath,
  title,

  topText,

  runtimeMinutes,
  seasonCount,

  genreLabel,

  detailPath,
}: BigPosterCardProps) => {
  const imageURL = useAppSelector((state) => state.moviesData.imageURL);

  const runtimeText = formatRuntime(runtimeMinutes);
  const seasonText = seasonCount ? `${seasonCount} Season${seasonCount > 1 ? "s" : ""}` : "";

  return (
    <Link
      to={detailPath}
      className="
        group block 
        w-40 xs:w-44 sm:w-52 md:w-56 
        cursor-pointer select-none
      "
    >
      <div
        className="
          overflow-hidden rounded-2xl
          bg-neutral-900 border border-neutral-800/80 
          shadow-md
          transition-all duration-300

          group-hover:border-red-500/80
          group-hover:shadow-[0_0_35px_rgba(248,113,113,0.65)]
        "
      >
        {/* POSTER */}
        <div className="relative w-full aspect-2/3 overflow-hidden">
          {posterPath ? (
            <img
              src={imageURL + posterPath}
              alt={title}
              loading="lazy"
              className="
                h-full w-full object-cover 
                transition-transform duration-700 
                group-hover:scale-[1.15]
              "
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-500">
              No Image
            </div>
          )}

          {/* OVERLAY GRADIENT */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

          {/* TOP TEXT */}
          {topText && (
            <div className="absolute top-2 left-0 right-0 flex justify-center">
              <span
                className="
                  px-2 text-[10px] xs:text-[11px] sm:text-xs
                  font-semibold uppercase tracking-[0.20em]
                  text-neutral-200
                  drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]
                "
              >
                {topText}
              </span>
            </div>
          )}

          {/* LOGO HOẶC TITLE */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center px-3">
            {logoPath ? (
              <img
                src={imageURL + logoPath}
                alt={title}
                className="
                  max-h-10 sm:max-h-12 object-contain
                  drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]
                "
              />
            ) : (
              <span
                className="
                  text-center text-sm sm:text-base font-bold tracking-wide text-white 
                  drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)]
                  line-clamp-2
                "
              >
                {title}
              </span>
            )}
          </div>
        </div>

        {/* THANH DƯỚI */}
        <div
          className="
            bg-black px-3 py-2 
            text-center text-[10px] xs:text-[11px] sm:text-xs 
            text-neutral-100
            flex flex-col items-center min-h-10 justify-center
          "
        >
          {runtimeText || seasonText || genreLabel ? (
            <>
              {/* Runtime hoặc Season */}
              {(runtimeText || seasonText) && (
                <span className="font-medium">
                  {runtimeText || seasonText}
                </span>
              )}

              {/* Genre */}
              {genreLabel && (
                <span className="text-neutral-300">{genreLabel}</span>
              )}
            </>
          ) : (
            <span>Coming soon</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BigPosterCard;
