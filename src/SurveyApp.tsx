import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useSurveyFetchOne } from "./hooks/useSurveyFetch";
import { useFormPersistence } from "./hooks/useFormPersistence";
import { useSurveyNavigation } from "./hooks/useSurveyNavigation";
import { SurveyForm } from "./components/SurveyForm";
import { SurveyLayout } from "./components/SurveyLayout";
import type { QuestionCategory, SurveyQuestion } from "./types/survey";
import { handleSurveySubmit } from "./utils/survey_submit_handler";
import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { SurveyModal } from "./components/SurveyModal";
import { SurveyNavigation } from "./components/SurveyNavigation";
import { scrollToField, scrollToFirstError } from "./utils/helpers";

export default function SurveyApp() {
  const { id } = useParams<{ id: string }>();

  const { data: surveyData, loading, error } = useSurveyFetchOne(id as string);

  // Set default values for RHF, including _other fields
  const defaultValues = useMemo(() => {
    if (!surveyData?.questions) return {};
    return surveyData.questions.reduce((acc, q) => {
      acc[q.id] = null;
      acc[`${q.id}_other`] = "";
      return acc;
    }, {} as Record<string, any>);
  }, [surveyData]);

  const form = useForm({ defaultValues });
  const {
    watch,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
    reset,
  } = form;

  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [submissionResponse, setSubmissionResponse] = useState<any | null>(
    null
  );

  // Watch ALL form values to ensure they're reactive
  const allFormValues = watch();

  const { clearSavedData } = useFormPersistence(form, allFormValues);

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

  // Restore persistence if exists
  useEffect(() => {
    const savedData = localStorage.getItem(`survey_${id}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      reset(parsedData);
    }
  }, [id, reset]);

  const onSubmit = async (_: any) => {
    // Force form to update its internal state
    await form.trigger();

    // Get ALL form values
    const allFormValues = getValues();

    console.log("All form values:", allFormValues); // Debug log

    const result = await handleSurveySubmit({
      formData: allFormValues, // Submit ALL data
      surveyData,
      id: id as string,
      clearSavedData,
      clearPageData,
      setSubmissionStatus,
      setValidationErrors,
    });

    if (result?.success) {
      setSubmissionResponse(result);
      clearSavedData();
      clearPageData();
      reset(defaultValues);
    }
  };
const handleNext = async () => {
  if (!currentCategory) return;

  clearErrors();

  // 1️⃣ Validate only current category
  const fields = currentCategory.questions.map((q) => String(q.id));
  const isValid = await trigger(fields);

  if (!isValid) {
    // Use latest formState.errors (never use old 'errors')
    scrollToFirstError(form.formState.errors);
    return;
  }

  // 2️⃣ Check for backend-verifiable fields
  const verifiableQuestions = currentCategory.questions.filter(
    (q) => q.constraints?.verifiable
  );

  if (verifiableQuestions.length > 0) {
    const verifyPayload: Record<string, any> = {};

    verifiableQuestions.forEach((q) => {
      verifyPayload[q.id] = getValues(String(q.id));
    });

    const res = await fetch(import.meta.env.VITE_SURVEY_URL_VERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verifyPayload),
    });

    const data = await res.json().catch(() => ({}));

    // ❌ Backend rejected
    if (!res.ok || data.valid === false) {
      let serverErrorKeys: string[] = [];

      // Field-level server errors
      if (data.errors) {
        Object.entries(data.errors).forEach(([fieldId, msg]) => {
          serverErrorKeys.push(fieldId);
          setError(String(fieldId), {
            type: "server",
            message: String(msg),
          });
        });
      }

      // Global error
      if (data.message) {
        setError("root", { type: "server", message: data.message });
      }

      // Scroll to first server error OR fallback to form errors
      if (serverErrorKeys.length > 0) {
        scrollToField(serverErrorKeys[0]);
      } else {
        scrollToFirstError(form.formState.errors);
      }
      return;
    }
  }

  // 3️⃣ Proceed
  if (isLastPage) {
    handleSubmit(onSubmit)();
  } else {
    nextCategory();
  }
};

  if (loading) return <div>Loading survey...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!surveyData || groupedQuestions.length === 0)
    return <div>There is no survey</div>;

  const { title, instructions } = surveyData.metadata ?? {};

  return (
    <FormProvider {...form}>
      <SurveyLayout title={title ?? ""} instructions={instructions ?? ""}>
        <div className="h-9/12">
          <SurveyForm
            form={form}
            onSubmit={onSubmit}
            currentCategory={currentCategory}
            surveyData={surveyData}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="h-3/12"></div>
        <SurveyNavigation
          onPrevious={prevCategory}
          onNext={handleNext}
          progress={progress}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
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
    </FormProvider>
  );
}
