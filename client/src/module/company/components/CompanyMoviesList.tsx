import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosTMDB from "../../../app/axiosTMDB";
import { useAppSelector } from "../../../hooks/UseCustomeRedux";

interface CompanyMovieBrief {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface CompanyMoviesListProps {
  companyId: number;
  imageBaseUrl: string;
}

const CompanyMoviesList = ({
  companyId,
  imageBaseUrl,
}: CompanyMoviesListProps) => {
  const [movies, setMovies] = useState<CompanyMovieBrief[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentLanguage = useAppSelector((state) => state.language.current);

  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosTMDB.get<{ results: CompanyMovieBrief[] }>(
          "/discover/movie",
          {
            params: {
              with_companies: companyId,
              language: currentLanguage,
              sort_by: "popularity.desc",
            },
          }
        );

        if (!cancelled) {
          setMovies(res.data.results ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Failed to fetch company movies", e);
          setError("Không tải được danh sách phim.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [companyId, currentLanguage]);

  if (loading && !movies.length) {
    return (
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Phim nổi bật của hãng
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Đang tải…
        </p>
      </section>
    );
  }

  if (error && !movies.length) {
    return (
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Phim nổi bật của hãng
        </h3>
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      </section>
    );
  }

  if (!movies.length) {
    return (
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Phim nổi bật của hãng
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Chưa có phim nào được hiển thị.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Phim nổi bật của hãng
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="
              group rounded-xl overflow-hidden
              bg-white/80 dark:bg-neutral-900/70
              border border-neutral-200/80 dark:border-neutral-800/80
              hover:border-neutral-300 dark:hover:border-neutral-700
              hover:bg-neutral-100 dark:hover:bg-neutral-800/80
              transition-colors flex flex-col
            "
          >
            <div className="aspect-2/3 bg-neutral-200 dark:bg-neutral-800">
              {movie.poster_path ? (
                <img
                  src={imageBaseUrl + movie.poster_path}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500 dark:text-neutral-400">
                  No Image
                </div>
              )}
            </div>

            <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                {movie.title}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                ⭐ {movie.vote_average?.toFixed(1) ?? "–"} •{" "}
                {movie.release_date || "N/A"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CompanyMoviesList;
