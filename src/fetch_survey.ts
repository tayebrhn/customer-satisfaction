import { useEffect, useState } from "react";
import type { SurveyExport } from "./types";

export function useSurveyExport(id: number) {
  const [data, setData] = useState<SurveyExport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurvey() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/surveys/${id}/export/`);
        if (!res.ok) throw new Error(`Failed to fetch survey ${id}`);
        const json: SurveyExport = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchSurvey();
  }, [id]);

  return { data, loading, error };
}
