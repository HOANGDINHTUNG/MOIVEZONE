import axiosTMDB from "../../app/axiosTMDB";

// ==== IMPORT TYPE MOVIE FULL ====
import type {
  TMDBMovieDetailsResponse,
  TMDBMovieSimilarResponse,
  TMDBMovieRecommendationsResponse,
  TMDBMovieReleaseDatesResponse,
  TMDBMovieReviewsResponse,
  TMDBMovieAlternativeTitlesResponse,
  TMDBMovieChangesResponse,
  TMDBMovieCreditsResponse,
  TMDBMovieExternalIdsResponse,
  TMDBMovieImagesResponse,
  TMDBMovieKeywordsResponse,
  TMDBLatestMovieResponse,
  TMDBMovieListsResponse,
  TMDBMovieTranslationsResponse,
  TMDBMovieWatchProvidersResponse,
} from "../../module/movies/database/interface/movie";

import type {
  TMDBNowPlayingResponse,
  TMDBPopularMoviesResponse,
  TMDBTopRatedMoviesResponse,
  TMDBUpcomingResponse,
} from "../../module/movies/database/interface/movieLists";
import type { AppLanguage } from "../../module/movies/store/languageSlice";

const defaultLanguage: AppLanguage = "vi-VN";

export const tmdbMoviesApi = {
  // ===========================
  // 📌 BASIC LIST (POPULAR, TOP…)
  // ===========================

  async getNowPlaying(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBNowPlayingResponse> {
    const res = await axiosTMDB.get<TMDBNowPlayingResponse>(
      "/movie/now_playing",
      {
        params: { page, language },
      }
    );
    return res.data;
  },

  async getPopular(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBPopularMoviesResponse> {
    const res = await axiosTMDB.get<TMDBPopularMoviesResponse>(
      "/movie/popular",
      {
        params: { page, language },
      }
    );
    return res.data;
  },

  async getTopRated(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTopRatedMoviesResponse> {
    const res = await axiosTMDB.get<TMDBTopRatedMoviesResponse>(
      "/movie/top_rated",
      {
        params: { page, language },
      }
    );
    return res.data;
  },

  async getUpcoming(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBUpcomingResponse> {
    const res = await axiosTMDB.get<TMDBUpcomingResponse>("/movie/upcoming", {
      params: { page, language },
    });
    return res.data;
  },

  // ===========================
  // 📌 MOVIE DETAILS
  // ===========================
  getDetails(movieId: number): Promise<TMDBMovieDetailsResponse> {
    return axiosTMDB.get(`/movie/${movieId}`).then((r) => r.data);
  },

  // ===========================
  // ⭐ SIMILAR & RECOMMENDATIONS
  // ===========================

  getSimilar(movieId: number): Promise<TMDBMovieSimilarResponse> {
    return axiosTMDB.get(`/movie/${movieId}/similar`).then((r) => r.data);
  },

  getRecommendations(
    movieId: number
  ): Promise<TMDBMovieRecommendationsResponse> {
    return axiosTMDB
      .get(`/movie/${movieId}/recommendations`)
      .then((r) => r.data);
  },

  // ===========================
  // 🎬 VIDEOS (Trailer, Teaser)
  // ===========================
  async getMovieVideos(id: number, language: AppLanguage = defaultLanguage) {
    const res = await axiosTMDB.get(`/movie/${id}/videos`, {
      params: { language },
    });
    return res.data;
  },

  // ===========================
  // 🧩 KEYWORDS
  // ===========================
  getKeywords(movieId: number): Promise<TMDBMovieKeywordsResponse> {
    return axiosTMDB.get(`/movie/${movieId}/keywords`).then((r) => r.data);
  },

  // ===========================
  // 🖼️ IMAGES (Poster, Backdrop, Logo)
  // ===========================
  getImages(movieId: number): Promise<TMDBMovieImagesResponse> {
    return axiosTMDB.get(`/movie/${movieId}/images`).then((r) => r.data);
  },

  // ===========================
  // 🎭 CREDITS (Cast & Crew)
  // ===========================
  getCredits(movieId: number): Promise<TMDBMovieCreditsResponse> {
    return axiosTMDB.get(`/movie/${movieId}/credits`).then((r) => r.data);
  },

  // ===========================
  // 🌎 TRANSLATIONS
  // ===========================
  getTranslations(movieId: number): Promise<TMDBMovieTranslationsResponse> {
    return axiosTMDB.get(`/movie/${movieId}/translations`).then((r) => r.data);
  },

  // ===========================
  // 📆 RELEASE DATES (Certification)
  // ===========================
  getReleaseDates(movieId: number): Promise<TMDBMovieReleaseDatesResponse> {
    return axiosTMDB.get(`/movie/${movieId}/release_dates`).then((r) => r.data);
  },

  // ===========================
  // 📝 REVIEWS
  // ===========================
  getReviews(movieId: number): Promise<TMDBMovieReviewsResponse> {
    return axiosTMDB.get(`/movie/${movieId}/reviews`).then((r) => r.data);
  },

  // ===========================
  // 🔗 EXTERNAL IDS
  // ===========================
  getExternalIds(movieId: number): Promise<TMDBMovieExternalIdsResponse> {
    return axiosTMDB.get(`/movie/${movieId}/external_ids`).then((r) => r.data);
  },

  // ===========================
  // 📺 WATCH PROVIDERS
  // ===========================
  getWatchProviders(movieId: number): Promise<TMDBMovieWatchProvidersResponse> {
    return axiosTMDB
      .get(`/movie/${movieId}/watch/providers`)
      .then((r) => r.data);
  },

  // ===========================
  // 🎭 ALTERNATIVE TITLES
  // ===========================
  getAlternativeTitles(
    movieId: number
  ): Promise<TMDBMovieAlternativeTitlesResponse> {
    return axiosTMDB
      .get(`/movie/${movieId}/alternative_titles`)
      .then((r) => r.data);
  },

  // ===========================
  // 🔄 CHANGES
  // ===========================
  getChanges(movieId: number): Promise<TMDBMovieChangesResponse> {
    return axiosTMDB.get(`/movie/${movieId}/changes`).then((r) => r.data);
  },

  // ===========================
  // 📚 LISTS CONTAIN THIS MOVIE
  // ===========================
  getLists(movieId: number): Promise<TMDBMovieListsResponse> {
    return axiosTMDB.get(`/movie/${movieId}/lists`).then((r) => r.data);
  },

  // ===========================
  // 🆕 LATEST MOVIE (RARELY USED)
  // ===========================
  getLatest(): Promise<TMDBLatestMovieResponse> {
    return axiosTMDB.get(`/movie/latest`).then((r) => r.data);
  },
};
