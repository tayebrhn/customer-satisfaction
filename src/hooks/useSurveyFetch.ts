import { useCallback, useEffect, useState } from "react";
import type { SurveyExport } from "../types/survey";

export function useSurveyFetch() {
  const [data, setData] = useState<SurveyExport[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchSurvey() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/surveys/`);

        if (!res.ok) throw new Error(`Failed to fetch survey`);
        const json: SurveyExport[] = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchSurvey();
  }, []);

  return { data, loading, error };
}
export function useSurveyFetchOne(lang:string,surveId: string) {
  const [data, setData] = useState<SurveyExport>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log("useSurveyFetchOne :", surveId);
  const fetchSurvey = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/surveys/${surveId}?lang=${lang}`);
      if (!res.ok) throw new Error(`Failed to fetch survey`);
      const json: SurveyExport = await res.json();
      
        console.log("fetchSurvey :", json);
      setData(json);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [surveId]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);
  return { data, loading, error };
}
