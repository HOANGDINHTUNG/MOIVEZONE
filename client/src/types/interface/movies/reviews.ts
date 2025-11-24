// Thông tin chi tiết về tác giả review
export interface ReviewAuthorDetails {
  name: string;                // Tên đầy đủ (có thể là chuỗi rỗng "")
  username: string;            // Username trên TMDB
  avatar_path: string | null;  // Đường dẫn avatar (có thể null, hoặc string kiểu "/https://secure.gravatar.com/...")
  rating: number | null;       // Điểm rating user chấm cho phim (0–10) hoặc null nếu không chấm
}

// Một review của người dùng cho phim
export interface MovieReview {
  author: string;                 // Tên tác giả (thường trùng hoặc liên quan username)
  author_details: ReviewAuthorDetails; // Thông tin chi tiết về tác giả
  content: string;                // Nội dung review (thường rất dài)
  created_at: string;             // Thời điểm tạo review (ISO string)
  id: string;                     // ID review trên TMDB
  updated_at: string;             // Thời điểm cập nhật lần cuối
  url: string;                    // Link trực tiếp đến review trên TMDB
}

// Response /movie/{movie_id}/reviews
export interface MovieReviewsResponse {
  id: number;              // ID phim (vd: 550)
  page: number;            // Trang hiện tại (pagination)
  results: MovieReview[];  // Danh sách các review
  total_pages: number;     // Tổng số trang review
  total_results: number;   // Tổng số review
}
