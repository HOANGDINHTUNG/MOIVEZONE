// Một release date chi tiết trong từng quốc gia
export interface MovieReleaseDateItem {
  certification: string;    // Giấy chứng nhận (rating) như "PG-13", "R", ...
  descriptors: string[];    // Mảng descriptor (ở JSON của bạn là [], nhưng khi có sẽ là các string)
  iso_639_1: string;        // Mã ngôn ngữ (thường "" hoặc "en")
  note: string;             // Ghi chú (thường là "", đôi khi có text)
  release_date: string;     // Thời gian phát hành (ISO datetime string)
  type: number;             // Loại phát hành (1..6: Premiere, Theatrical, Digital, TV, ...)
}

// Block kết quả cho từng quốc gia
export interface MovieReleaseResult {
  iso_3166_1: string;               // Mã quốc gia (vd: "BG", "US", "TH")
  release_dates: MovieReleaseDateItem[]; // Danh sách các release date trong quốc gia đó
}

// Response /movie/{movie_id}/release_dates
export interface MovieReleaseDatesResponse {
  id: number;                  // ID phim (vd: 550)
  results: MovieReleaseResult[]; // Các quốc gia + ngày phát hành tương ứng
}
