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

  /**
   * Role để phân quyền UI/route.
   * - user: người dùng bình thường
   * - admin: quản trị
   *
   * NOTE: để tương thích dữ liệu cũ (db.json chưa có role),
   * app sẽ tự fallback về "user" khi thiếu.
   */
  role?: "user" | "admin";

  /**
   * Trạng thái tài khoản.
   * - active: hoạt động
   * - blocked: bị chặn
   *
   * NOTE: để tương thích dữ liệu cũ (db.json chưa có status),
   * app sẽ tự fallback về "active" khi thiếu.
   */
  status?: "active" | "blocked";

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

  role?: "user" | "admin";
  status?: "active" | "blocked";

  apiKey?: string;
  sessionId?: string;
  accountId?: number;
}
