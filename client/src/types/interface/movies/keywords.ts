// Một keyword của phim
export interface MovieKeyword {
  id: number;    // ID keyword trong TMDB (defaults to 0)
  name: string;  // Tên/từ khóa mô tả nội dung phim (vd: "revenge", "kung fu")
}

// Response của Movie Keywords endpoint
export interface MovieKeywords {
  id: number;             // ID phim (defaults to 0)
  keywords: MovieKeyword[]; // Danh sách từ khóa của phim
}
