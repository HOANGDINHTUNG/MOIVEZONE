export interface TMDBCreditMediaSeason {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  show_id: number;
}

export interface TMDBCreditMedia {
  adult: boolean;
  backdrop_path: string | null;
  id: number;

  // Movie or TV name fields
  name: string;
  original_language: string;
  original_name: string;

  overview: string;
  poster_path: string | null;

  media_type: string; // "movie" | "tv"
  genre_ids: number[];
  popularity: number;

  // For TV
  first_air_date?: string;
  origin_country?: string[];

  // Rating info
  vote_average: number;
  vote_count: number;

  // Extra fields if credit belongs to a TV series
  character?: string;
  episodes?: unknown[]; // TMDB để rỗng
  seasons?: TMDBCreditMediaSeason[];
}

export interface TMDBCreditPerson {
  adult: boolean;
  id: number;
  name: string;
  original_name: string;
  media_type: string; // "person"
  popularity: number;
  gender: number;
  known_for_department: string;
  profile_path: string | null;
}

export interface TMDBCreditDetailsResponse {
  credit_type: string; // "cast" | "crew"
  department: string; // ví dụ: "Acting", "Production"
  job: string; // ví dụ: "Director", "Actor"

  media: TMDBCreditMedia; // thông tin movie hoặc TV
  person: TMDBCreditPerson; // thông tin diễn viên/người làm phim

  id: string; // credit_id
}
