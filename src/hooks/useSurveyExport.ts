import { useEffect, useState, useCallback } from "react";
import type { SurveyExport } from "../types/survey";

// Type guard to check if it's an array
function isSurveyExportArray(data: any): data is SurveyExport[] {
  return Array.isArray(data) && (data.length === 0 || 'id' in data[0]);
}

// Type guard to check if it's a single object
function isSurveyExport(data: any): data is SurveyExport {
  return data && typeof data === 'object' && 'id' in data && !Array.isArray(data);
}

export function useSurveyExport(surveyID?: string) {
  const [data, setData] = useState<SurveyExport | SurveyExport[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurvey = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiSurveyID = surveyID 
        ? `http://127.0.0.1:8000/api/surveys/${surveyID}`
        : `http://127.0.0.1:8000/api/surveys/`;
      
      const res = await fetch(apiSurveyID);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch survey: ${res.status} ${res.statusText}`);
      }
      
      const json = await res.json();
      
      // Use type guards for runtime type checking
      if (surveyID && isSurveyExport(json)) {
        setData(json);
      } else if (!surveyID && isSurveyExportArray(json)) {
        setData(json);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [surveyID]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  return { data, loading, error, refetch: fetchSurvey };
}