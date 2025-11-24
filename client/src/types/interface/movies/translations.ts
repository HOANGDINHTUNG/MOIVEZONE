// Dữ liệu bản dịch chi tiết cho một ngôn ngữ
export interface MovieTranslationData {
  homepage: string;   // Trang chủ của phim (cho ngôn ngữ này, nếu có bản địa hóa)
  overview: string;   // Mô tả phim bằng ngôn ngữ này
  runtime: number;    // Thời lượng phim (integer, defaults to 0)
  tagline: string;    // Tagline được dịch
  title: string;      // Tựa phim được dịch
}

// Một bản dịch của phim cho một cặp ngôn ngữ/quốc gia
export interface MovieTranslation {
  iso_3166_1: string;          // Mã quốc gia (vd: "US", "VN", "JP")
  iso_639_1: string;           // Mã ngôn ngữ (vd: "en", "vi", "ja")
  name: string;                // Tên ngôn ngữ hiển thị (vd: "Vietnamese")
  english_name: string;        // Tên ngôn ngữ bằng tiếng Anh (vd: "Vietnamese")
  data: MovieTranslationData;  // Dữ liệu nội dung đã dịch
}

// Response chính của /movie/{movie_id}/translations
export interface MovieTranslationsResponse {
  id: number;                  // ID phim (defaults to 0)
  translations: MovieTranslation[]; // Danh sách các bản dịch
}
