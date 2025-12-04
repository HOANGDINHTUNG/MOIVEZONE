import axiosTMDB from "../../app/axiosTMDB";

// ==== IMPORT FULL TV TYPES ====
import type {
  TMDBTvDetailsResponse,
  TMDBTvSimilarResponse,
  TMDBTvRecommendationsResponse,
  TMDBTvReviewsResponse,
  TMDBTvExternalIdsResponse,
  TMDBTvImagesResponse,
  TMDBTvKeywordsResponse,
  TMDBTvAccountStatesResponse,
  TMDBTvAggregateCreditsResponse,
  TMDBTvAlternativeTitlesResponse,
  TMDBTvChangesResponse,
  TMDBTvContentRatingsResponse,
  TMDBTvCreditsResponse,
  TMDBTvEpisodeGroupsResponse,
  TMDBTvListsResponse,
  TMDBTvScreenedTheatricallyResponse,
  TMDBTvTranslationsResponse,
  TMDBTvVideosResponse,
  TMDBTvWatchProvidersResponse,
  TMDBLatestTvResponse,
} from "../../module/movies/database/interface/tv";

import type {
  TMDBTvAiringTodayResponse,
  TMDBTvOnTheAirResponse,
  TMDBTvPopularResponse,
  TMDBTvTopRatedResponse,
} from "../../module/movies/database/interface/tvList";
import type { AppLanguage } from "../../module/movies/store/languageSlice";

const defaultLanguage: AppLanguage = "vi-VN";

export const tmdbTvApi = {
  // ===========================
  // 📌 BASIC LIST (POPULAR, TOP…)
  // ===========================

  // getAiringToday(): Promise<TMDBTvAiringTodayResponse> {
  //   return axiosTMDB.get("/tv/airing_today").then((r) => r.data);
  // },

  async getAiringToday(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTvAiringTodayResponse> {
    const res = await axiosTMDB.get<TMDBTvAiringTodayResponse>("/tv/airing_today", {
      params: { page, language },
    });
    return res.data;
  },

  async getOnTheAirTv(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTvOnTheAirResponse> {
    const res = await axiosTMDB.get<TMDBTvOnTheAirResponse>("/tv/on_the_air", {
      params: { page, language },
    });
    return res.data;
  },

  async getPopularTv(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTvPopularResponse> {
    const res = await axiosTMDB.get<TMDBTvPopularResponse>("/tv/popular", {
      params: { page, language },
    });
    return res.data;
  },

  async getTopRated(
    page = 1,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTvTopRatedResponse> {
    const res = await axiosTMDB.get<TMDBTvTopRatedResponse>("/tv/top_rated", {
      params: { page, language },
    });
    return res.data;
  },

  // getTopRated(): Promise<TMDBTvTopRatedResponse> {
  //   return axiosTMDB.get("/tv/top_rated").then((r) => r.data);
  // },

  // ===========================
  // 📌 DETAILS
  // ===========================

  getDetails(seriesId: number): Promise<TMDBTvDetailsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}`).then((r) => r.data);
  },

  // ===========================
  // ⭐ SIMILAR & RECOMMENDATIONS
  // ===========================

  getSimilar(seriesId: number): Promise<TMDBTvSimilarResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/similar`).then((r) => r.data);
  },

  getRecommendations(seriesId: number): Promise<TMDBTvRecommendationsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/recommendations`).then((r) => r.data);
  },

  // ===========================
  // 🎬 VIDEOS (Trailer, Teaser)
  // ===========================

  async getTvVideos(
    id: number,
    language: AppLanguage = defaultLanguage
  ): Promise<TMDBTvVideosResponse> {
    const res = await axiosTMDB.get(`/tv/${id}/videos`, {
      params: { language },
    });
    return res.data;
  },

  // ===========================
  // 🖼️ IMAGES
  // ===========================

  getImages(seriesId: number): Promise<TMDBTvImagesResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/images`).then((r) => r.data);
  },

  // ===========================
  // 🎭 CREDITS (Cast & Crew)
  // ===========================

  getCredits(seriesId: number): Promise<TMDBTvCreditsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/credits`).then((r) => r.data);
  },

  // ===========================
  // 🎭 AGGREGATE CREDITS (Full seasons)
  // ===========================

  getAggregateCredits(
    seriesId: number
  ): Promise<TMDBTvAggregateCreditsResponse> {
    return axiosTMDB
      .get(`/tv/${seriesId}/aggregate_credits`)
      .then((r) => r.data);
  },

  // ===========================
  // ⭐ ALTERNATIVE TITLES
  // ===========================

  getAlternativeTitles(
    seriesId: number
  ): Promise<TMDBTvAlternativeTitlesResponse> {
    return axiosTMDB
      .get(`/tv/${seriesId}/alternative_titles`)
      .then((r) => r.data);
  },

  // ===========================
  // 🌎 TRANSLATIONS
  // ===========================

  getTranslations(seriesId: number): Promise<TMDBTvTranslationsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/translations`).then((r) => r.data);
  },

  // ===========================
  // 🧩 KEYWORDS
  // ===========================

  getKeywords(seriesId: number): Promise<TMDBTvKeywordsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/keywords`).then((r) => r.data);
  },

  // ===========================
  // 📆 EPISODE GROUPS
  // ===========================

  getEpisodeGroups(seriesId: number): Promise<TMDBTvEpisodeGroupsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/episode_groups`).then((r) => r.data);
  },

  // ===========================
  // 📺 WATCH PROVIDERS
  // ===========================

  getWatchProviders(seriesId: number): Promise<TMDBTvWatchProvidersResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/watch/providers`).then((r) => r.data);
  },

  // ===========================
  // 🔗 EXTERNAL IDS
  // ===========================

  getExternalIds(seriesId: number): Promise<TMDBTvExternalIdsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/external_ids`).then((r) => r.data);
  },

  // ===========================
  // 📝 REVIEWS
  // ===========================

  getReviews(seriesId: number): Promise<TMDBTvReviewsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/reviews`).then((r) => r.data);
  },

  // ===========================
  // 🔄 CHANGES
  // ===========================

  getChanges(seriesId: number): Promise<TMDBTvChangesResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/changes`).then((r) => r.data);
  },

  // ===========================
  // 📚 LISTS
  // ===========================

  getLists(seriesId: number): Promise<TMDBTvListsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/lists`).then((r) => r.data);
  },

  // ===========================
  // 🔞 CONTENT RATINGS
  // ===========================

  getContentRatings(seriesId: number): Promise<TMDBTvContentRatingsResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/content_ratings`).then((r) => r.data);
  },

  // ===========================
  // 🎬 SCREENED THEATRICALLY
  // ===========================

  getScreenedTheatrically(
    seriesId: number
  ): Promise<TMDBTvScreenedTheatricallyResponse> {
    return axiosTMDB
      .get(`/tv/${seriesId}/screened_theatrically`)
      .then((r) => r.data);
  },

  // ===========================
  // ⭐ ACCOUNT STATES
  // ===========================

  getAccountStates(seriesId: number): Promise<TMDBTvAccountStatesResponse> {
    return axiosTMDB.get(`/tv/${seriesId}/account_states`).then((r) => r.data);
  },

  // ===========================
  // 🆕 LATEST TV SHOW
  // ===========================

  getLatest(): Promise<TMDBLatestTvResponse> {
    return axiosTMDB.get(`/tv/latest`).then((r) => r.data);
  },
};
