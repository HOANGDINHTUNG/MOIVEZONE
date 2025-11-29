export type TMDBChangeMediaType = "movie" | "tv" | "person";

export interface TMDBChangeItem {
  id: number;
  adult: boolean;
}

export interface TMDBChangesResponse {
  results: TMDBChangeItem[];
  page: number;
  total_pages: number;
  total_results: number;
}
