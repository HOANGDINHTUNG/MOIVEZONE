// src/api/movie/TMDBReview.api.ts
import axiosTMDB from "../../app/axiosTMDB";
import type { TMDBReviewDetails } from "../../module/review/database/interface/review";

export const tmdbReviewApi = {
  getReview: async (
    reviewId: string,
    language?: string
  ): Promise<TMDBReviewDetails> => {
    const query = language ? `?language=${language}` : "";
    const { data } = await axiosTMDB.get<TMDBReviewDetails>(
      `/review/${reviewId}${query}`
    );
    return data;
  },
};
