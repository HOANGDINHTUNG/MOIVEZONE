import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBTvAiringTodayResponse,
  TMDBTvOnTheAirResponse,
  TMDBTvPopularResponse,
  TMDBTvTopRatedResponse,
} from "../../module/movies/database/interface/tvList";

export const tmdbTvApi = {
  getAiringToday(): Promise<TMDBTvAiringTodayResponse> {
    return axiosTMDB
      .get<TMDBTvAiringTodayResponse>("/tv/airing_today")
      .then((res) => res.data);
  },

  getOnTheAir(): Promise<TMDBTvOnTheAirResponse> {
    return axiosTMDB
      .get<TMDBTvOnTheAirResponse>("/tv/on_the_air")
      .then((res) => res.data);
  },

  getPopular(): Promise<TMDBTvPopularResponse> {
    return axiosTMDB
      .get<TMDBTvPopularResponse>("/tv/popular")
      .then((res) => res.data);
  },

  getTopRated(): Promise<TMDBTvTopRatedResponse> {
    return axiosTMDB
      .get<TMDBTvTopRatedResponse>("/tv/top_rated")
      .then((res) => res.data);
  },
};
