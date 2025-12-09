import type { TMDBMovieDetailsResponse } from "../../../movies/database/interface/movie";
import type { TMDBTvDetailsResponse } from "../../../movies/database/interface/tv";
import type { IUserMediaItem, UserMediaType } from "../../database/interface/users";

export function buildUserMediaItemFromMovie(
  movie: TMDBMovieDetailsResponse
): IUserMediaItem {
  return {
    id: movie.id,
    mediaType: "movie",
    title: movie.title || movie.original_title,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    overview: movie.overview,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    releaseDate: movie.release_date || null,
    addedAt: new Date().toISOString(),
  };
}

export function buildUserMediaItemFromTv(
  tv: TMDBTvDetailsResponse
): IUserMediaItem {
  return {
    id: tv.id,
    mediaType: "tv",
    title: tv.name || tv.original_name,
    posterPath: tv.poster_path,
    backdropPath: tv.backdrop_path,
    overview: tv.overview,
    voteAverage: tv.vote_average,
    voteCount: tv.vote_count,
    releaseDate: tv.first_air_date || null,
    addedAt: new Date().toISOString(),
  };
}

export function buildUserMediaItem(
  mediaType: UserMediaType,
  data: TMDBMovieDetailsResponse | TMDBTvDetailsResponse
): IUserMediaItem {
  return mediaType === "movie"
    ? buildUserMediaItemFromMovie(data as TMDBMovieDetailsResponse)
    : buildUserMediaItemFromTv(data as TMDBTvDetailsResponse);
}
