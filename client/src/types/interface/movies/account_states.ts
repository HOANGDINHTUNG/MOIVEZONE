// Trạng thái đánh giá (rating) của người dùng cho phim
export interface UserRatedValue {
  value: number; // Giá trị rating người dùng đánh (0–10 hoặc 0.5–10 theo kiểu TMDB)
}

// Trạng thái của một movie trong tài khoản của người dùng
export interface AccountStates {
  id: number;           // ID phim (trùng với movie_id)
  favorite: boolean;    // Người dùng đã đánh dấu "favorite" phim này hay chưa
  rated: UserRatedValue | boolean; 
  /*
    TMDB có 2 dạng:
    - Nếu user đã đánh giá → { value: number }
    - Nếu chưa đánh giá → false
    nên ta để dạng union.
  */
  watchlist: boolean;   // Phim có nằm trong watchlist của user không
}
