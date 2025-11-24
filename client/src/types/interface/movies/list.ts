// Một list mà phim xuất hiện trong đó
export interface MovieListItem {
  description: string;        // Mô tả về list (có thể là chuỗi rỗng "")
  favorite_count: number;     // Số người đã favorite list này
  id: number;                 // ID của list
  item_count: number;         // Số lượng phim trong list
  iso_639_1: string;          // Ngôn ngữ list (vd: "en", "es", "fr", "th", "ar", ...)
  list_type: string;          // Loại list (thường là "movie")
  name: string;               // Tên list
  poster_path: string | null; // Có thể null (như JSON bạn gửi) hoặc string nếu có poster
}

// Response từ /movie/{movie_id}/lists
export interface MovieListsResponse {
  id: number;                // ID phim ( ở đây: 550 )
  page: number;              // Trang hiện tại (vd: 1)
  results: MovieListItem[];  // Các list mà phim này nằm trong
  total_pages: number;       // Tổng số trang (vd: 122)
  total_results: number;     // Tổng số list (vd: 2422)
}
