import axiosTMDB from "../../app/axiosTMDB";
import type {
  TMDBConfigurationResponse,
  TMDBCountriesResponse,
  TMDBJobsResponse,
  TMDBLanguagesResponse,
  TMDBPrimaryTranslationsResponse,
  TMDBTimezonesResponse,
} from "../../module/configuration/database/interface/configuration";

export const tmdbConfigApi = {
  getConfiguration(): Promise<TMDBConfigurationResponse> {
    return axiosTMDB
      .get<TMDBConfigurationResponse>("/configuration")
      .then((res) => res.data);
  },

  getCountries(): Promise<TMDBCountriesResponse> {
    return axiosTMDB
      .get<TMDBCountriesResponse>("/configuration/countries")
      .then((res) => res.data);
  },

  getJobs(): Promise<TMDBJobsResponse> {
    return axiosTMDB
      .get<TMDBJobsResponse>("/configuration/jobs")
      .then((res) => res.data);
  },

  getLanguages(): Promise<TMDBLanguagesResponse> {
    return axiosTMDB
      .get<TMDBLanguagesResponse>("/configuration/languages")
      .then((res) => res.data);
  },

  getPrimaryTranslations(): Promise<TMDBPrimaryTranslationsResponse> {
    return axiosTMDB
      .get<TMDBPrimaryTranslationsResponse>(
        "/configuration/primary_translations"
      )
      .then((res) => res.data);
  },

  getTimezones(): Promise<TMDBTimezonesResponse> {
    return axiosTMDB
      .get<TMDBTimezonesResponse>("/configuration/timezones")
      .then((res) => res.data);
  },
};
