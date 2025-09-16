// SurveyApp.tsx
import { FormProvider, useForm } from "react-hook-form";
import type { QuestionCategory, SurveyQuestion } from "./types/survey";
import { useSurveyFetchOne } from "./hooks/useSurveyFetch.ts";
import { useFormPersistence } from "./hooks/useFormPersistence";
import { useSurveyNavigation } from "./hooks/useSurveyNavigation";
import { QuestionRenderer } from "./components/QuestionRenderer";
import { SurveyNavigation } from "./components/SurveyNavigation";
import { ProgressBar } from "./components/ProgressBar";
import { Header } from "./components/Header.tsx";
import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";

export default function SurveyApp() {
  const { id } = useParams<{ id: string }>();
  const form = useForm({});
  const { handleSubmit, watch, trigger } = form;
  const { data: surveyData, loading, error } = useSurveyFetchOne(id as string);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const formValues = watch();
  const { clearSavedData } = useFormPersistence(form, formValues);

  const groupedQuestions = useMemo(() => {
    if (!surveyData?.question_categories) return [];
    return surveyData.question_categories.map((cat: QuestionCategory) => ({
      ...cat,
      questions: surveyData.questions.filter(
        (q: SurveyQuestion) => q.category === cat.id
      ),
    }));
  }, [surveyData]);

  const {
    currentCategoryIndex,
    nextCategory,
    prevCategory,
    progress,
    isFirstPage,
    isLastPage,
    clearPageData,
  } = useSurveyNavigation(groupedQuestions.length);

  const currentCategory = useMemo(() => {
    const nonEmptyCategories = groupedQuestions
      .filter((cat) => cat.questions && cat.questions.length > 0) // keep only categories with questions
      .sort((a, b) => a.cat_number - b.cat_number);

    return nonEmptyCategories[currentCategoryIndex];
  }, [groupedQuestions, currentCategoryIndex]);

  const onSubmit = async (formData: any) => {
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

    const surveyResponse = {
      survey_id: id,
      respondent_info: {
        ip_address: "192.168.1.1",
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

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      setSubmissionStatus("success");
      clearSavedData();
      clearPageData();
    } catch (err) {
      console.error("Failed to submit survey:", err);
      setSubmissionStatus("error");
    }
  };

  if (loading) return <div>Loading survey...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!surveyData || groupedQuestions.length === 0)
    return <div>No survey found</div>;

  const { title, instructions } = surveyData.metadata ?? {};
  const fieldsForCurrentCategory = currentCategory?.questions?.map((q) =>
    String(q.id)
  );

  return (
    <>
      <Header title={title ?? ""} instructions={instructions ?? ""} />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 max-w-2xl mx-auto"
            >
              {currentCategory?.questions?.map((q) => (
                <div key={q.id} className="border p-4 rounded shadow-sm">
                  <p className="mb-2 font-medium">{q.question}</p>
                  <QuestionRenderer
                    question={q}
                    choices={surveyData.key_choice}
                  />
                </div>
              ))}

              <ProgressBar progress={progress} />

              <SurveyNavigation
                onPrevious={prevCategory}
                onNext={async () => {
                  const isValid = await trigger(fieldsForCurrentCategory);
                  if (isValid) nextCategory();
                }}
                onSubmit={() => handleSubmit(onSubmit)()}
                isFirstPage={isFirstPage}
                isLastPage={isLastPage}
              />

              {submissionStatus === "loading" && (
                <p className="text-blue-500 mt-4">Submitting...</p>
              )}
              {submissionStatus === "success" && (
                <p className="text-green-600 mt-4">
                  ✅ Thank you! Your responses have been submitted.
                </p>
              )}
              {submissionStatus === "error" && (
                <p className="text-red-600 mt-4">
                  ❌ Oops! Something went wrong. Please try again.
                </p>
              )}
            </form>
          </FormProvider>
        </div>
      </main>
    </>
  );
}
