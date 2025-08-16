import { useEffect, useState } from "react";
import type { SurveyExport } from "../types/survey";

export function useSurveyExport() {
  const [data, setData] = useState<SurveyExport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurvey() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/surveys/`);
        if (!res.ok) throw new Error(`Failed to fetch survey`);
        const json = await res.json();
        setData(json[0]);
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
