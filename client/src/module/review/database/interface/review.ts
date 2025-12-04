export interface TMDBReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface TMDBReviewDetails {
  id: string;
  author: string;
  author_details: TMDBReviewAuthorDetails;

  content: string;

  created_at: string;
  updated_at: string;

  iso_639_1: string | null;

  media_id: number;
  media_title: string;
  media_type: string; // "movie" | "tv"

  url: string;
}
