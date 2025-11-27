/**
 * Một item trong danh sách "changes"
 * Lưu ý: adult chỉ xuất hiện cho movie và person; TV đôi khi không có nhưng TMDB vẫn giữ field.
 */
export interface TMDBChangeItem {
  id: number;
  adult: boolean;
}

/**
 * Response chuẩn cho 3 API:
 * - /movie/changes
 * - /person/changes
 * - /tv/changes
 */
export interface TMDBChangesResponse {
  results: TMDBChangeItem[];
  page: number;
  total_pages: number;
  total_results: number;
}
