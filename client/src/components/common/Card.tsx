// src/components/common/Card.tsx
import moment from "moment";
import { Link } from "react-router-dom";
import type { MediaType } from "../../module/movies/database/interface/tmdb";
import type {
  MovieSummary,
  MovieDetail,
} from "../../module/movies/database/interface/movie";
import type {
  TvSummary,
  TvDetail,
} from "../../module/movies/database/interface/tv";
import { useAppSelector } from "../../hooks/UseCustomeRedux";

type CardMovie = MovieSummary | MovieDetail | TvSummary | TvDetail;

interface CardProps {
  data: CardMovie;
  trending?: boolean;
  index?: number;
  media_type?: MediaType; // "movie" | "tv"
}

const Card = ({ data, trending, index, media_type = "movie" }: CardProps) => {
  const imageURL = useAppSelector((state) => state.moviesData.imageURL);

  const title =
    "title" in data ? data.title : "name" in data ? data.name : "No title";

  const date =
    "release_date" in data
      ? data.release_date
      : "first_air_date" in data
      ? data.first_air_date
      : undefined;

  const poster = data.poster_path || data.backdrop_path;

  const detailPath =
    media_type === "tv" ? `/tv/${data.id}` : `/movie/${data.id}`;

  return (
    <Link
      to={detailPath}
      className="w-40 shrink-0 cursor-pointer transform hover:scale-105 transition-transform duration-200"
    >
      <div className="relative w-full h-60 bg-neutral-800 rounded-lg overflow-hidden">
        {poster ? (
          <img
            src={imageURL + poster}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
            No Image
          </div>
        )}

        {trending && typeof index === "number" && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            #{index + 1}
          </span>
        )}
      </div>

      <div className="mt-2 space-y-1">
        <h2 className="text-sm font-semibold line-clamp-2">{title}</h2>
        <div className="text-xs text-neutral-500">
          <p>{date ? moment(date).format("MMMM Do YYYY") : "Unknown date"}</p>
        </div>
        <div className="flex">
          <p className="bg-amber-900 px-1 rounded-full text-[11px] text-white">
            Rating: {Number(data.vote_average ?? 0).toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
