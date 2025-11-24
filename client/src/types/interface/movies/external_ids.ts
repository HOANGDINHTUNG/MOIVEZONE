// External IDs của một phim trên TMDB
export interface ExternalIDs {
  id: number;         // ID phim trên TMDB (defaults to 0)
  imdb_id: string;    // ID phim trên IMDb (vd: "tt0137523")
  wikidata_id: string; // ID trang phim trong Wikidata (vd: "Q103987")
  facebook_id: string; // ID trang Facebook (chỉ chuỗi ID, không phải URL)
  instagram_id: string; // ID trang Instagram
  twitter_id: string;   // ID tài khoản Twitter/X
}
