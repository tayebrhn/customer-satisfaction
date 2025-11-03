import type { SurveyQuestion } from "../types/survey";

export async function handleSurveySubmit({
  formData,
  surveyData,
  id,
  clearSavedData,
  clearPageData,
  setSubmissionStatus,
}: {
  formData: any;
  surveyData: any;
  id: string;
  clearSavedData: () => void;
  clearPageData: () => void;
  setSubmissionStatus: (s: "idle" | "loading" | "success" | "error") => void;
}) {
  setSubmissionStatus("loading");

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
            selected_option: Number(value) || null,
            text_value: otherValue,
            ...(otherValue ? { is_other: true } : {}),
          };
          break;
        case "multi_select":
          base.answer = {
            selected_option: (value) || [],
            text_value: otherValue,
          };
          break;
        case "text":
        case "text_area":
          base.answer = { text_value: value || "" };
          break;
        case "number":
          base.answer = {
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
            selected_option: String(value) || null,
            text_value: otherValue,
          };
          break;
        default:
          return null;
      }
      return base;
    })
    .filter(Boolean);
    
    const surveyResponse = {
      survey_id: id,
      respondent_info: {
        ip_address: "192.168.1.1",
        user_agent: navigator.userAgent,
        session_id: "optional_session_identifier",
      },
      responses,
    };
    console.log(surveyResponse)

  try {
    const res = await fetch(import.meta.env.VITE_SURVEY_URL_SUBMIT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(surveyResponse),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    setSubmissionStatus("success");
    clearSavedData();
    clearPageData();
  } catch (err) {
    console.error("Failed to submit survey:", err);
    setSubmissionStatus("error");
  }
}
