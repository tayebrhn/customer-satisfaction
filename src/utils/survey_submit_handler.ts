import type {
  SurveyQuestion,
  SurveySubmitResponse,
  SurveySubmitResult,
  ValidationError,
} from "../types/survey";

export async function handleSurveySubmit({
  formData,
  surveyData,
  id,
  clearSavedData,
  clearPageData,
  setSubmissionStatus,
  setValidationErrors,
}: {
  formData: any;
  surveyData: any;
  id: string;
  clearSavedData: () => void;
  clearPageData: () => void;
  setSubmissionStatus: (s: "idle" | "loading" | "success" | "error") => void;
  setValidationErrors: (errors: ValidationError[]) => void;
}) {
  setSubmissionStatus("loading");
  setValidationErrors([]);

  const responses = surveyData?.questions
    .map((q: SurveyQuestion) => {
      const value = formData[q.id];
      const otherValue = formData[`${q.id}_other`] || null;

      const base = {
        question_id: q.id,
        question_type: q.type,
        answer: {} as any,
      };

      switch (q.type) {
        case "single_choice":
          base.answer = {
            selected_option_id: Number(value) || null,
            text_value: otherValue,
            ...(otherValue ? { is_other: true } : {}),
          };
          break;
        case "multi_select":
          base.answer = {
            selected_option_ids: value || [],
            text_value: otherValue,
          };
          break;
        case "text":
        case "text_area":
          base.answer = { selected_option_id: null, text_value: value || "" };
          break;
        case "number":
          base.answer = {
            selected_option_id: null,
            number_value: Number(value) || null,
          };
          break;
        case "rating":
          base.answer = {
            selected_option_id: null,
            rating_value: Number(value) || null,
          };
          break;
        case "drop_down":
          base.answer = {
            selected_option_id: Number(value) || null,
            text_value: otherValue,
          };
          break;
        default:
          return null;
      }
      return base;
    })
    .filter(Boolean);
  console.log(responses);
  const surveyResponse = {
    survey_id: id,
    respondent_info: {
      ip_address: "192.5.1.1",
      user_agent: navigator.userAgent,
      session_id: "optional_session_identifier",
    },
    responses,
  };

  try {
    const res = await fetch(import.meta.env.VITE_SURVEY_URL_SUBMIT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(surveyResponse),
    });

    const json: SurveySubmitResult = await res.json();

    if (!res.ok || json.success === false) {
      // Backend validation errors
      if ("errors" in json && json.errors?.length) {
        setValidationErrors(json.errors);
      }
      setSubmissionStatus("error");
      return;
    }

    // Success: you can pass json to /survey/completion
    setSubmissionStatus("success");
    clearSavedData();
    clearPageData();

    return json as SurveySubmitResponse;
  } catch (err) {
    // console.error("Failed to submit survey:", err);
    setSubmissionStatus("error");
  }
}
