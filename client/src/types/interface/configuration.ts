// src/module/configuration/interface/configuration.ts

/**
 * =========================
 *  CONFIGURATION DETAILS
 * =========================
 */

export interface TMDBImageConfig {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}

export interface TMDBConfigurationResponse {
  images: TMDBImageConfig;
  change_keys: string[];
}

/**
 * =========================
 *  COUNTRIES
 * =========================
 */

export interface TMDBCountry {
  iso_3166_1: string;     // mã quốc gia
  english_name: string;   // tên tiếng Anh
  native_name: string;    // tên bản địa
}

export type TMDBCountriesResponse = TMDBCountry[];

/**
 * =========================
 *  JOBS
 * =========================
 */

export interface TMDBJobDepartment {
  department: string;     // ví dụ: "Production"
  jobs: string[];         // ví dụ: ["Producer", "Executive Producer"]
}

export type TMDBJobsResponse = TMDBJobDepartment[];

/**
 * =========================
 *  LANGUAGES
 * =========================
 */

export interface TMDBLanguage {
  iso_639_1: string;      // mã ngôn ngữ
  english_name: string;   // tên tiếng Anh
  name: string;           // tên bản địa (có thể rỗng)
}

export type TMDBLanguagesResponse = TMDBLanguage[];

/**
 * =========================
 *  TIMEZONES
 * =========================
 */

export interface TMDBTimezone {
  iso_3166_1: string;     // mã quốc gia
  zones: string[];        // danh sách các timezone
}

export type TMDBTimezonesResponse = TMDBTimezone[];
