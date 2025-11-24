// Một video (trailer/teaser/clip/featurette...) của phim
export interface MovieVideoItem {
  iso_639_1: string;   // Mã ngôn ngữ (vd: "en", "ja")
  iso_3166_1: string;  // Mã quốc gia (vd: "US", "GB")
  name: string;        // Tên video (vd: "Official Trailer", "Teaser Trailer")
  key: string;         // Key dùng để build URL trên site (YouTube/Vimeo)
  site: string;        // Nền tảng, thường là "YouTube" hoặc "Vimeo"
  size: number;        // Độ phân giải, vd: 360, 480, 720, 1080
  type: string;        // Loại video: "Trailer", "Teaser", "Clip", "Featurette", ...
  official: boolean;   // Có phải video chính thức hay không (defaults to true)
  published_at: string; // Ngày giờ publish video (ISO datetime string)
  id: string;          // ID video trong database của TMDB
}

// Response từ /movie/{movie_id}/videos
export interface MovieVideosResponse {
  id: number;             // ID phim (defaults to 0)
  results: MovieVideoItem[]; // Danh sách video của phim
}
