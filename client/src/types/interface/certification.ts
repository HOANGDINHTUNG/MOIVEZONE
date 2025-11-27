export interface TMDBCertificationItem {
  certification: string; // Ví dụ: "PG-13", "R", "MA15+", "12A"
  meaning: string;       // Giải thích ý nghĩa của nhãn
  order: number;         // Dùng để sắp xếp
}

// Key = mã quốc gia ("AU", "US", "BR", "CA", ...)
export interface TMDBCertificationResponse {
  certifications: Record<string, TMDBCertificationItem[]>;
}
