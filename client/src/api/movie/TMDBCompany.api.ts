// src/api/TMDBCompany.api.ts

import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBCompanyAltNamesResponse,
  TMDBCompanyDetailsResponse,
  TMDBCompanyImagesResponse,
} from "../../module/company/database/interface/company";

/**
 * Company details
 * GET /company/{company_id}
 */
export const getCompanyDetails = (id: number) =>
  axiosTMDB.get<TMDBCompanyDetailsResponse>(`/company/${id}`);

/**
 * Company alternative names
 * GET /company/{company_id}/alternative_names
 */
export const getCompanyAltNames = (id: number) =>
  axiosTMDB.get<TMDBCompanyAltNamesResponse>(
    `/company/${id}/alternative_names`
  );

/**
 * Company images (logos)
 * GET /company/{company_id}/images
 */
export const getCompanyImages = (id: number) =>
  axiosTMDB.get<TMDBCompanyImagesResponse>(`/company/${id}/images`);
