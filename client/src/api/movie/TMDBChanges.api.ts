import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBChangeMediaType,
  TMDBChangesResponse,
} from "../../module/changes/database/interface/changes";

export interface TMDBChangesParams {
  page?: number;
  start_date?: string; // "YYYY-MM-DD" (tuỳ bạn có dùng không)
  end_date?: string; // "YYYY-MM-DD"
}

export const tmdbChangesApi = {
  getChanges(
    mediaType: TMDBChangeMediaType,
    params: TMDBChangesParams = {}
  ): Promise<TMDBChangesResponse> {
    const endpoint =
      mediaType === "movie"
        ? "/movie/changes"
        : mediaType === "tv"
        ? "/tv/changes"
        : "/person/changes";

    return axiosTMDB
      .get<TMDBChangesResponse>(endpoint, {
        params, // page, start_date, end_date nếu dùng
      })
      .then((res) => res.data);
  },
};
