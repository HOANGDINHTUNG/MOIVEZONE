import axiosTMDB from "../app/axiosTMDB";
import type {
  TMDBCollectionDetailsResponse,
  TMDBCollectionImagesResponse,
  TMDBCollectionTranslationsResponse,
} from "../module/collections/database/interface/collection";

export const getCollectionDetails = (id: number, language?: string) =>
  axiosTMDB.get<TMDBCollectionDetailsResponse>(`/collection/${id}`, {
    params: { language },
  });

export const getCollectionImages = (id: number) =>
  axiosTMDB.get<TMDBCollectionImagesResponse>(`/collection/${id}/images`);

export const getCollectionTranslations = (id: number) =>
  axiosTMDB.get<TMDBCollectionTranslationsResponse>(
    `/collection/${id}/translations`
  );
