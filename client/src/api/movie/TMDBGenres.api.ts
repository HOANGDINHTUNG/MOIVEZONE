import axiosTMDB from "../../app/axiosTMDB";
import type { TMDBGenreListResponse } from "../../module/movies/database/interface/genre";

export const tmdbGenresApi = {
  getMovieGenres(): Promise<TMDBGenreListResponse> {
    return axiosTMDB
      .get<TMDBGenreListResponse>("/genre/movie/list")
      .then((res) => res.data);
  },

  getTvGenres(): Promise<TMDBGenreListResponse> {
    return axiosTMDB
      .get<TMDBGenreListResponse>("/genre/tv/list")
      .then((res) => res.data);
  },
};
