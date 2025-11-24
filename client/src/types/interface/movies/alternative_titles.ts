// Một tựa đề thay thế của phim
export interface AlternativeTitleItem {
  iso_3166_1: string; // Mã quốc gia (vd: "US", "JP", "VN")
  title: string;      // Tựa đề thay thế của phim ở nước đó
  type: string;       // Loại tựa đề (vd: "working title", "international", "festival")
}

// Response chính của endpoint Alternative Titles
export interface AlternativeTitles {
  id: number;                   // ID phim (mặc định 0 nếu không có)
  titles: AlternativeTitleItem[]; // Danh sách các tựa đề thay thế
}
