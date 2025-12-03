import axiosTMDB from "../../app/axiosTMDB";
import type { TMDBTimeWindow, TMDBTrendingAllResponse, TMDBTrendingMoviesResponse, TMDBTrendingPeopleResponse, TMDBTrendingTvResponse } from "../../module/trending/database/interface/trending";

export const tmdbTrendingApi = {
  getTrendingAll: async (
    timeWindow: TMDBTimeWindow = "day",
    page = 1,
    language?: string
  ): Promise<TMDBTrendingAllResponse> => {
    const res = await axiosTMDB.get(`/trending/all/${timeWindow}`, {
      params: {
        page,
        language,
      },
    });
    return res.data;
  },

  getTrendingMovies: async (
    timeWindow: TMDBTimeWindow = "day",
    page = 1,
    language?: string
  ): Promise<TMDBTrendingMoviesResponse> => {
    const res = await axiosTMDB.get(`/trending/movie/${timeWindow}`, {
      params: {
        page,
        language,
      },
    });
    return res.data;
  },

  getTrendingTv: async (
    timeWindow: TMDBTimeWindow = "day",
    page = 1,
    language?: string
  ): Promise<TMDBTrendingTvResponse> => {
    const res = await axiosTMDB.get(`/trending/tv/${timeWindow}`, {
      params: {
        page,
        language,
      },
    });
    return res.data;
  },

  getTrendingPeople: async (
    timeWindow: TMDBTimeWindow = "day",
    page = 1,
    language?: string
  ): Promise<TMDBTrendingPeopleResponse> => {
    const res = await axiosTMDB.get(`/trending/person/${timeWindow}`, {
      params: {
        page,
        language,
      },
    });
    return res.data;
  },
};
