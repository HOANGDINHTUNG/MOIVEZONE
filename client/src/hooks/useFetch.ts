// src/hooks/useFetch.ts
import { useEffect, useState } from "react";
import axiosTMDB from "../app/axiosTMDB";
import { useAppSelector } from "./UseCustomeRedux";
import type { TMDBListResponse } from "../module/movies/database/interface/movieLists";

export function useFetch<T>(endpoint: string, extraParams?: Record<string, unknown>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const language = useAppSelector((state) => state.language.current);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosTMDB.get<TMDBListResponse<T>>(endpoint, {
          params: {
            language,
            ...(extraParams || {}),
          },
        });
        if (!ignore) {
          setData(res.data.results || []);
        }
      } catch (error) {
        console.error("useFetch error:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [endpoint, language, JSON.stringify(extraParams)]);

  return { data, loading };
}
