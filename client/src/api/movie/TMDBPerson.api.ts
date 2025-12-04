import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBLatestPersonResponse,
  TMDBPersonChangesResponse,
  TMDBPersonCombinedCredits,
  TMDBPersonDetails,
  TMDBPersonExternalIds,
  TMDBPersonImagesResponse,
  TMDBPersonMovieCredits,
  TMDBPersonTaggedImagesResponse,
  TMDBPersonTranslationsResponse,
  TMDBPersonTvCredits,
  TMDBPopularPersonsResponse,
} from "../../module/persons/database/interface/person";

const withLanguage = (language?: string) =>
  language ? `?language=${language}` : "";

export const tmdbPersonApi = {
  getDetails: async (personId: number, language?: string) => {
    const { data } = await axiosTMDB.get<TMDBPersonDetails>(
      `/person/${personId}${withLanguage(language)}`
    );
    return data;
  },

  getChanges: async (personId: number) => {
    const { data } = await axiosTMDB.get<TMDBPersonChangesResponse>(
      `/person/${personId}/changes`
    );
    return data;
  },

  getCombinedCredits: async (personId: number, language?: string) => {
    const { data } = await axiosTMDB.get<TMDBPersonCombinedCredits>(
      `/person/${personId}/combined_credits${withLanguage(language)}`
    );
    return data;
  },

  getExternalIds: async (personId: number) => {
    const { data } = await axiosTMDB.get<TMDBPersonExternalIds>(
      `/person/${personId}/external_ids`
    );
    return data;
  },

  getImages: async (personId: number) => {
    const { data } = await axiosTMDB.get<TMDBPersonImagesResponse>(
      `/person/${personId}/images`
    );
    return data;
  },

  getLatest: async (language?: string) => {
    const { data } = await axiosTMDB.get<TMDBLatestPersonResponse>(
      `/person/latest${withLanguage(language)}`
    );
    return data;
  },

  getMovieCredits: async (personId: number, language?: string) => {
    const { data } = await axiosTMDB.get<TMDBPersonMovieCredits>(
      `/person/${personId}/movie_credits${withLanguage(language)}`
    );
    return data;
  },

  getTvCredits: async (personId: number, language?: string) => {
    const { data } = await axiosTMDB.get<TMDBPersonTvCredits>(
      `/person/${personId}/tv_credits${withLanguage(language)}`
    );
    return data;
  },

  getTaggedImages: async (personId: number, page = 1) => {
    const { data } = await axiosTMDB.get<TMDBPersonTaggedImagesResponse>(
      `/person/${personId}/tagged_images?page=${page}`
    );
    return data;
  },

  getTranslations: async (personId: number) => {
    const { data } = await axiosTMDB.get<TMDBPersonTranslationsResponse>(
      `/person/${personId}/translations`
    );
    return data;
  },

  getPopular: async (
    page = 1,
    language?: string
  ): Promise<TMDBPopularPersonsResponse> => {
    const { data } = await axiosTMDB.get<TMDBPopularPersonsResponse>(
      `/person/popular?page=${page}${language ? `&language=${language}` : ""}`
    );
    return data;
  },
};
