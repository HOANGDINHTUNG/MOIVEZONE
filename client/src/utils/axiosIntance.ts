import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:3000";

export const axiosInstance = axios.create({
  baseURL: BASE_URL + "/", // đảm bảo luôn có trailing slash 1 lần
  timeout: 15000, // rộng hơn cho Render free
  headers: { "Content-Type": "application/json" },
});
