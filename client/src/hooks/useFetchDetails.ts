// src/hooks/useFetchDetails.ts
import { useEffect, useState } from "react";
import axiosTMDB from "../app/axiosTMDB";
import { useAppSelector } from "./UseCustomeRedux";
import type { AxiosError } from "axios";

export function useFetchDetails<T>(
  endpoint: string,
  extraParams?: Record<string, unknown>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const language = useAppSelector((state) => state.language.current);

  useEffect(() => {
    if (!endpoint) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosTMDB.get<T>(endpoint, {
          signal: controller.signal,
          params: {
            language,
            ...(extraParams || {}),
          },
        });

        setData(res.data);
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;

        // Lấy message từ axios hoặc fallback
        setError(
          axiosErr.response?.status
            ? `${axiosErr.response.status} - ${axiosErr.response.statusText}`
            : axiosErr.message || "Error fetching details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [endpoint, language, JSON.stringify(extraParams)]);

  return { data, loading, error };
}
