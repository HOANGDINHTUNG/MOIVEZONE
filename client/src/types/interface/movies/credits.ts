// Diễn viên (cast) của phim
export interface CastMember {
  adult: boolean;              // Người này có tham gia các nội dung 18+ hay không (mặc định true trong docs)
  gender: number;              // Giới tính (0 = unknown, 1 = nữ, 2 = nam, 3 = khác – theo TMDB)
  id: number;                  // ID người này trong TMDB (mặc định 0)
  known_for_department: string; // Bộ phận/nghề chính mà người này nổi tiếng (vd: "Acting")
  name: string;                // Tên hiển thị
  original_name: string;       // Tên gốc (tránh trường hợp có phiên âm)
  popularity: number;          // Độ phổ biến (score nội bộ của TMDB, mặc định 0)
  profile_path: string;        // Đường dẫn ảnh profile (avatar) của người này

  cast_id: number;             // ID cast nội bộ (mặc định 0)
  character: string;           // Tên nhân vật mà người này đóng trong phim
  credit_id: string;           // ID credit (dùng để tham chiếu credit cụ thể)
  order: number;               // Thứ tự xuất hiện trong danh sách cast (0 là quan trọng nhất)
}

// Thành viên đoàn làm phim (crew) – đạo diễn, biên kịch, quay phim, v.v.
export interface CrewMember {
  adult: boolean;              // Người này có liên quan nội dung 18+ không
  gender: number;              // Giới tính (0,1,2,3 giống trên)
  id: number;                  // ID người này trong TMDB (mặc định 0)
  known_for_department: string; // Bộ phận/nghề chính (vd: "Directing", "Writing")
  name: string;                // Tên hiển thị
  original_name: string;       // Tên gốc
  popularity: number;          // Độ phổ biến (mặc định 0)
  profile_path: string;        // Ảnh profile (string, có thể rỗng nếu không có ảnh)

  credit_id: string;           // ID credit
  department: string;          // Bộ phận trong đoàn (vd: "Directing", "Writing", "Production")
  job: string;                 // Công việc cụ thể (vd: "Director", "Writer", "Producer")
}

// Response body của endpoint credits
export interface MovieCreditsResponse {
  id: number;          // ID phim (mặc định 0 nếu docs ghi vậy)
  cast: CastMember[];  // Danh sách diễn viên
  crew: CrewMember[];  // Danh sách thành viên đoàn làm phim (đạo diễn, quay phim, v.v.)
}
