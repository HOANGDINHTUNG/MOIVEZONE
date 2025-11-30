import type {
  TMDBPaginatedResponse,
  TMDBRatedEpisodeListItem,
  TMDBRatedMovieListItem,
  TMDBRatedTvListItem,
} from "../../module/accounts/database/interface/account";

export type TMDBGuestRatedMoviesResponse =
  TMDBPaginatedResponse<TMDBRatedMovieListItem>;

export type TMDBGuestRatedTvResponse =
  TMDBPaginatedResponse<TMDBRatedTvListItem>;

export type TMDBGuestRatedEpisodesResponse =
  TMDBPaginatedResponse<TMDBRatedEpisodeListItem>;
