import axiosTMDB from "../app/axiosTMDB";
import type { TMDBCreditDetailsResponse } from "../module/credits/database/interface/credit";

export const tmdbCreditApi = {
  getCreditDetails(creditId: string): Promise<TMDBCreditDetailsResponse> {
    return axiosTMDB
      .get<TMDBCreditDetailsResponse>(`/credit/${creditId}`)
      .then((res) => res.data);
  },
};
