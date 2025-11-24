// src/hooks/useFetchDetails.ts
import { useEffect, useState } from "react";
import axiosTMDB from "../app/axiosTMDB";
import { useAppSelector } from "./UseCustomeRedux";

export function useFetchDetails<T>(endpoint: string, extraParams?: Record<string, unknown>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const language = useAppSelector((state) => state.language.current);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosTMDB.get<T>(endpoint, {
          params: {
            language,
            ...(extraParams || {}),
          },
        });
        if (!ignore) {
          setData(res.data);
        }
      } catch (error) {
        console.error("useFetchDetails error:", error);
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
