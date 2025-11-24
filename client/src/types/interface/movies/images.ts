// Một ảnh bất kỳ trong TMDB Images (poster, backdrop, logo)
export interface MovieImageItem {
  aspect_ratio: number; // Tỉ lệ chiều rộng / chiều cao (mac̣ định 0)
  height: number; // Chiều cao pixel (mặc định 0)
  iso_639_1: string; // Mã ngôn ngữ ảnh ("" nếu không gắn ngôn ngữ)
  file_path: string; // Đường dẫn ảnh (relative)
  vote_average: number; // Điểm trung bình vote cho ảnh đó (0 nếu chưa vote)
  vote_count: number; // Lượt vote ảnh
  width: number; // Chiều rộng pixel (mặc định 0)
}

// Response chính của Images endpoint
export interface MovieImages {
  id: number; // ID ảnh (docs cho mặc định 0)
  backdrops: MovieImageItem[]; // Ảnh nền — khổ ngang lớn
  logos: MovieImageItem[]; // Logo phim — thường PNG trong suốt
  posters: MovieImageItem[]; // Poster dọc — ảnh bìa của phim
}
