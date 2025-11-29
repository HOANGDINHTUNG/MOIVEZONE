export interface TMDBCompanyDetailsResponse {
  description: string | null;
  headquarters: string | null;
  homepage: string | null;
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
  parent_company: string | null; // thực tế TMDB có thể trả object, nhưng docs trả string → để string | null
}

export interface TMDBCompanyAltName {
  name: string;
  type: string;
}

export interface TMDBCompanyAltNamesResponse {
  id: number;
  results: TMDBCompanyAltName[];
}

export interface TMDBCompanyLogo {
  aspect_ratio: number;
  file_path: string;
  height: number;
  id: string; // chuỗi, vì TMDB mô tả id logo là string
  file_type: string; // ví dụ: "svg" hoặc "png"
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBCompanyImagesResponse {
  id: number;
  logos: TMDBCompanyLogo[];
}
