export type UserMediaType = "movie" | "tv";

export interface IUserMediaItem {
  id: number; // TMDB id
  mediaType: UserMediaType; // "movie" | "tv"
  title: string; // title hoặc name
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  voteAverage: number;
  voteCount: number;
  releaseDate: string | null; // release_date hoặc first_air_date
  addedAt: string; // ISO string, để sort
}

export interface IUser {
  id: number;
  email: string;
  username: string;
  password: string;

  // TMDB info nếu sau này bạn vẫn muốn dùng
  apiKey: string;
  sessionId: string;
  accountId: number;

  // Data riêng của app (local)
  favorites: IUserMediaItem[]; // yêu thích
  watchlist: IUserMediaItem[]; // muốn xem
  history: IUserMediaItem[]; // đã xem / đã mở

  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  username: string;
  password: string;

  apiKey?: string;
  sessionId?: string;
  accountId?: number;
}
