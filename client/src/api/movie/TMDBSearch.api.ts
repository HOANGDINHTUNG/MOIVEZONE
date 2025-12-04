import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBSearchCollectionResponse,
  TMDBSearchCompanyResponse,
  TMDBSearchKeywordResponse,
  TMDBSearchMovieResponse,
  TMDBSearchMultiResponse,
  TMDBSearchPersonResponse,
  TMDBSearchTvResponse,
} from "../../module/search/database/interface/search";

export type SearchCategory =
  | "multi"
  | "movie"
  | "tv"
  | "person"
  | "collection"
  | "company"
  | "keyword";

interface BaseSearchParams {
  query: string;
  page?: number;
  language?: string;
  include_adult?: boolean;
}

// từng hàm riêng (nếu cần xài ở chỗ khác)
export const tmdbSearchApi = {
  searchCollection: (params: BaseSearchParams) =>
    axiosTMDB
      .get<TMDBSearchCollectionResponse>("/search/collection", { params })
      .then((res) => res.data),

  searchCompany: (params: BaseSearchParams) =>
    axiosTMDB
      .get<TMDBSearchCompanyResponse>("/search/company", { params })
      .then((res) => res.data),

  searchKeyword: (params: BaseSearchParams) =>
    axiosTMDB
      .get<TMDBSearchKeywordResponse>("/search/keyword", { params })
      .then((res) => res.data),

  searchMovie: (params: BaseSearchParams) =>
    axiosTMDB
      .get<TMDBSearchMovieResponse>("/search/movie", { params })
      .then((res) => res.data),

  searchTv: (params: BaseSearchParams) =>
    axiosTMDB
      .get<TMDBSearchTvResponse>("/search/tv", { params })
      .then((res) => res.data),

  searchPerson: (params: BaseSearchParams) =>
    axiosTMDB
      .get<TMDBSearchPersonResponse>("/search/person", { params })
      .then((res) => res.data),

  searchMulti: (params: BaseSearchParams) =>
    axiosTMDB
      .get<TMDBSearchMultiResponse>("/search/multi", { params })
      .then((res) => res.data),
};
