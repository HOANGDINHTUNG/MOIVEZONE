// src/api/TMDBCollection.api.ts

import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBCollectionDetailsResponse,
  TMDBCollectionImagesResponse,
  TMDBCollectionTranslationsResponse,
} from "../../module/collections/database/interface/collection";

// Chi tiết collection theo ngôn ngữ
export const getCollectionDetails = (id: number, language?: string) =>
  axiosTMDB.get<TMDBCollectionDetailsResponse>(`/collection/${id}`, {
    params: { language },
  });

// Ảnh collection – ưu tiên ảnh theo ngôn ngữ
export const getCollectionImages = (id: number, language?: string) =>
  axiosTMDB.get<TMDBCollectionImagesResponse>(`/collection/${id}/images`, {
    params: {
      // TMDB: liệt kê các ngôn ngữ ảnh muốn lấy
      // ví dụ: "vi,null" → ảnh tiếng Việt + ảnh không gán ngôn ngữ
      include_image_language: language ? `${language},null` : "en,null",
    },
  });

// Translations: có đủ tiêu đề / overview / tagline các ngôn ngữ
export const getCollectionTranslations = (id: number) =>
  axiosTMDB.get<TMDBCollectionTranslationsResponse>(
    `/collection/${id}/translations`
  );
