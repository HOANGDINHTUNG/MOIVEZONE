import { Link } from "react-router-dom";
import type { MovieDetail } from "../database/interface/movie";

interface MovieCardProps {
  movie: MovieDetail;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movie/${movie.id}`} className="swiper-slide">
      <div className="film-card">
        <div className="image-wrapper">
          <img src={movie.poster_path} alt={movie.title} />
        </div>
        <div className="description mt-2">
          <div className="category">
            {movie.genres && movie.genres.length > 0
              ? movie.genres.map((g) => g.name).join(", ")
              : "Đang cập nhật"}
          </div>
        </div>
        <span className="film-title">{movie.title}</span>
      </div>
    </Link>
  );
}
