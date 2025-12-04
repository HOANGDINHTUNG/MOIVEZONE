export interface TMDBCollectionPart {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string; // tên phim trong collection
  original_name: string; // tên gốc
  overview: string;
  poster_path: string | null;
  media_type: string; // thường là "movie"
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBCollectionDetailsResponse {
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: TMDBCollectionPart[]; // danh sách phim trong bộ sưu tập
}

export interface TMDBImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBCollectionImagesResponse {
  id: number;
  backdrops: TMDBImage[];
  posters: TMDBImage[];
}

export interface TMDBCollectionTranslationData {
  title?: string | null;
  overview?: string | null;
  tagline?: string | null;
  homepage?: string | null;
}

export interface TMDBCollectionTranslation {
  iso_3166_1: string; // mã quốc gia, ví dụ: "US", "VN"
  iso_639_1: string; // mã ngôn ngữ, ví dụ: "en", "vi"
  name: string; // tên theo ngôn ngữ đó
  english_name: string; // tên tiếng Anh của ngôn ngữ
  data: TMDBCollectionTranslationData;
}

export interface TMDBCollectionTranslationsResponse {
  id: number;
  translations: TMDBCollectionTranslation[];
}
