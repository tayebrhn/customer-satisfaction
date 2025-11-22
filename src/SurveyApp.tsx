import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useSurveyFetchOne } from "./hooks/useSurveyFetch";
import { useFormPersistence } from "./hooks/useFormPersistence";
import { useSurveyNavigation } from "./hooks/useSurveyNavigation";
import { SurveyForm } from "./components/SurveyForm";
import { SurveyLayout } from "./components/SurveyLayout";
import type { QuestionCategory, SurveyQuestion } from "./types/survey";
import { handleSurveySubmit } from "./utils/survey_submit_handler";
import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { SurveyModal } from "./components/SurveyModal";
import { SurveyNavigation } from "./components/SurveyNavigation";

export default function SurveyApp() {
  const { id } = useParams<{ id: string }>();
  const form = useForm({});
  const { watch ,handleSubmit} = form;
  const { getValues, setError, clearErrors,trigger } = useFormContext();

  const { data: surveyData, loading, error } = useSurveyFetchOne(id as string);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const formValues = watch();
  const { clearSavedData } = useFormPersistence(form, formValues);
  const [submissionResponse, setSubmissionResponse] = useState<any | null>(
    null
  );

  const groupedQuestions = useMemo(() => {
    if (!surveyData?.question_categories) return [];
    return surveyData.question_categories.map((cat: QuestionCategory) => ({
      ...cat,
      questions: surveyData.questions.filter(
        (q: SurveyQuestion) => q.category === cat.id
      ),
    }));
  }, [surveyData]);
  const nonEmptyCategories = useMemo(() => {
    return groupedQuestions
      .filter((cat) => cat.questions && cat.questions.length > 0)
      .sort((a, b) => a.cat_number - b.cat_number);
  }, [groupedQuestions]);

  const {
    currentCategoryIndex,
    nextCategory,
    prevCategory,
    progress,
    isFirstPage,
    isLastPage,
    clearPageData,
  } = useSurveyNavigation(nonEmptyCategories.length);

  const currentCategory = nonEmptyCategories[currentCategoryIndex];

  const onSubmit = async (formData: any) => {
    const result = await handleSurveySubmit({
      formData,
      surveyData,
      id: id as string,
      clearSavedData,
      clearPageData,
      setSubmissionStatus,
      setValidationErrors,
    });
    if (result?.success) {
      setSubmissionResponse(result);
    }
  };

  if (loading) return <div>Loading survey...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!surveyData || groupedQuestions.length === 0)
    return <div>There is no survey</div>;

  const { title, instructions } = surveyData.metadata ?? {};
 const handleNext = async () => {
    const fields = currentCategory?.questions.map((q) => String(q.id));

    // 1. Frontend validation for this page
    const isValid = await trigger(fields);
    if (!isValid) return;

    // 2. Get verifiable fields on this page
    const verifiableQuestions = currentCategory?.questions.filter(
      (q) => q.constraints?.verifiable
    );

    if (verifiableQuestions && verifiableQuestions.length > 0) {
      // Prepare payload
      const verifyPayload: Record<string, any> = {};

      verifiableQuestions.forEach((q) => {
        verifyPayload[q.id] = getValues(String(q.id));
      });

      // 3. Send verification to backend
      const res = await fetch("http://127.0.0.1:8000/api/survey/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verifyPayload),
      });

      const data = await res.json().catch(() => ({}));

      // ❌ Backend validation failed
      if (!res.ok || data.valid === false) {
        // (a) Field-level backend errors
        console.log("ERROR:", data.errors);
        if (data.errors) {
          Object.entries(data.errors).forEach(([fieldId, msg]) => {
            setError(String(fieldId), {
              type: "server",
              message: String(msg),
            });
          });
        }

        // (b) Global backend error
        if (data.message) {
          setError("root", {
            type: "server",
            message: data.message,
          });
        }

        return; // ❌ Stay on the same page
      }

      // If backend verification passed → clear any previous errors
      clearErrors();
    }

    // 4. Continue normally
    if (isLastPage) {
      handleSubmit(onSubmit)();
    } else {
      nextCategory();
    }
  };
  return (
    <SurveyLayout title={title ?? ""} instructions={instructions ?? ""}>
        <SurveyForm
          form={form}
          onSubmit={onSubmit}
          currentCategory={currentCategory}
          surveyData={surveyData}
          handleSubmit={handleSubmit}
        />
      <SurveyNavigation
        onPrevious={prevCategory}
        onNext={handleNext}
        progress={progress}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
      {/* Success/Error Modal */}
      <SurveyModal
        status={submissionStatus}
        validationErrors={validationErrors}
        onClose={() => {
          setSubmissionStatus("idle");
          setValidationErrors([]);
        }}
        response={submissionResponse}
      />
    </SurveyLayout>
  );
}
