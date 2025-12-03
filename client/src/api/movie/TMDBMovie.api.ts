import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBNowPlayingResponse,
  TMDBPopularMoviesResponse,
  TMDBTopRatedMoviesResponse,
  TMDBUpcomingResponse,
} from "../../module/movies/database/interface/movieLists";

export const tmdbMoviesApi = {
  getNowPlaying(): Promise<TMDBNowPlayingResponse> {
    return axiosTMDB
      .get<TMDBNowPlayingResponse>("/movie/now_playing")
      .then((res) => res.data);
  },

  getPopular(): Promise<TMDBPopularMoviesResponse> {
    return axiosTMDB
      .get<TMDBPopularMoviesResponse>("/movie/popular")
      .then((res) => res.data);
  },

  getTopRated(): Promise<TMDBTopRatedMoviesResponse> {
    return axiosTMDB
      .get<TMDBTopRatedMoviesResponse>("/movie/top_rated")
      .then((res) => res.data);
  },

  getUpcoming(): Promise<TMDBUpcomingResponse> {
    return axiosTMDB
      .get<TMDBUpcomingResponse>("/movie/upcoming")
      .then((res) => res.data);
  },
};
