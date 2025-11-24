// Một nhà cung cấp (Netflix, Prime, Disney+, …)
export interface WatchProvider {
  display_priority: number; // Độ ưu tiên hiển thị (sắp xếp trong UI)
  logo_path: string;        // Đường dẫn logo provider
  provider_id: number;      // ID provider trong TMDB/JustWatch
  provider_name: string;    // Tên provider (vd: "Netflix", "Disney Plus")
}

// Các loại hình xem phim trong một quốc gia
export interface CountryWatchOptions {
  link: string;              // Link đến trang "Where to Watch" trên TMDB

  // Xem dạng "thuê bao" (subscription: Netflix, Disney+, Prime…)
  flatrate?: WatchProvider[];

  // Xem miễn phí có quảng cáo
  ads?: WatchProvider[];

  // Xem free hoàn toàn
  free?: WatchProvider[];

  // Thuê (rent) phim
  rent?: WatchProvider[];

  // Mua bản quyền (mua đứt)
  buy?: WatchProvider[];
}

// Response của /movie/{movie_id}/watch/providers
export interface WatchProvidersResponse {
  id: number;  // ID phim
  // results là object: key = mã quốc gia (vd: "US", "GB", "VN")
  results: {
    [countryCode: string]: CountryWatchOptions;
  };
}

