import axiosTMDB from "../../app/axiosTMDB";
import type { TMDBCertificationResponse } from "../../module/certifications/database/interface/certification";

export const getMovieCertifications = () =>
  axiosTMDB.get<TMDBCertificationResponse>("/certification/movie/list");

export const getTvCertifications = () =>
  axiosTMDB.get<TMDBCertificationResponse>("/certification/tv/list");
