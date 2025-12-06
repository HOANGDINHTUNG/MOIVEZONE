import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBTvSeasonDetail,
  TMDBTvSeasonAccountStates,
  TMDBTvSeasonAggregateCredits,
  TMDBTvSeasonChangesResponse,
  TMDBTvSeasonCredits,
  TMDBTvSeasonExternalIds,
  TMDBTvSeasonImages,
  TMDBTvSeasonTranslations,
  TMDBTvSeasonVideos,
  TMDBTvSeasonWatchProviders,
} from "../../module/tv/database/interface/tv_season";

// Season detail + append_to_response
export interface TMDBTvSeasonDetailFull extends TMDBTvSeasonDetail {
  account_states?: TMDBTvSeasonAccountStates;
  aggregate_credits?: TMDBTvSeasonAggregateCredits;
  credits?: TMDBTvSeasonCredits;
  external_ids?: TMDBTvSeasonExternalIds;
  images?: TMDBTvSeasonImages;
  translations?: TMDBTvSeasonTranslations;
  videos?: TMDBTvSeasonVideos;
}

const APPEND = [
  "account_states",
  "aggregate_credits",
  "credits",
  "external_ids",
  "images",
  "translations",
  "videos",
].join(",");

export const tmdbTvSeasonApi = {
  async getSeasonDetailFull(params: {
    seriesId: number;
    seasonNumber: number;
    language: string;
  }): Promise<TMDBTvSeasonDetailFull> {
    const { seriesId, seasonNumber, language } = params;

    const res = await axiosTMDB.get<TMDBTvSeasonDetailFull>(
      `/tv/${seriesId}/season/${seasonNumber}`,
      {
        params: {
          language,
          append_to_response: APPEND,
        },
      }
    );

    return res.data;
  },

  async getSeasonWatchProviders(params: {
    seriesId: number;
    seasonNumber: number;
  }): Promise<TMDBTvSeasonWatchProviders> {
    const { seriesId, seasonNumber } = params;

    const res = await axiosTMDB.get<TMDBTvSeasonWatchProviders>(
      `/tv/${seriesId}/season/${seasonNumber}/watch/providers`
    );

    return res.data;
  },

  async getSeasonChanges(params: {
    seasonId: number;
  }): Promise<TMDBTvSeasonChangesResponse> {
    const { seasonId } = params;

    const res = await axiosTMDB.get<TMDBTvSeasonChangesResponse>(
      `/tv/season/${seasonId}/changes`
    );

    return res.data;
  },
};
