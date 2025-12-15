import axios from "axios";

const PROD_URL = "https://moivezone-1.onrender.com";

const BASE_URL =
  (import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
    PROD_URL.replace(/\/+$/, "") ||
    "http://localhost:3000");

export const axiosInstance = axios.create({
  baseURL: BASE_URL + "/", // luôn có đúng 1 trailing slash
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
