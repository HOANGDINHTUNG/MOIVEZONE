// src/module/networks/interface/network.ts

/**
 * ============================================================
 *  NETWORK DETAILS — GET /network/{network_id}
 * ============================================================
 */
export interface TMDBNetworkDetails {
  headquarters: string | null;
  homepage: string | null;
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

/**
 * ============================================================
 *  ALTERNATIVE NAMES — GET /network/{network_id}/alternative_names
 * ============================================================
 */
export interface TMDBNetworkAltName {
  name: string;
  type: string;
}

export interface TMDBNetworkAltNamesResponse {
  id: number;
  results: TMDBNetworkAltName[];
}

/**
 * ============================================================
 *  NETWORK IMAGES — GET /network/{network_id}/images
 * ============================================================
 */
export interface TMDBNetworkLogo {
  aspect_ratio: number;
  file_path: string;
  height: number;
  id: string;          // TMDB trả dạng string
  file_type: string;   // "png" | "svg"
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBNetworkImagesResponse {
  id: number;
  logos: TMDBNetworkLogo[];
}
