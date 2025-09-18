import { useForm } from "react-hook-form";
import { useSurveyFetchOne } from "./hooks/useSurveyFetch";
import { useFormPersistence } from "./hooks/useFormPersistence";
import { useSurveyNavigation } from "./hooks/useSurveyNavigation";
import { SurveyForm } from "./components/SurveyForm";
import { SurveyLayout } from "./components/SurveyLayout";
import type { QuestionCategory, SurveyQuestion } from "./types/survey";
import { handleSurveySubmit } from "./utils/survey_submit_handler";
import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";

export default function SurveyApp() {
  const { id } = useParams<{ id: string }>();
  const form = useForm({});
  const { watch } = form;

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
    const nonEmpty = groupedQuestions
      .filter((cat) => cat.questions && cat.questions.length > 0)
      .sort((a, b) => a.cat_number - b.cat_number);

    return nonEmpty[currentCategoryIndex];
  }, [groupedQuestions, currentCategoryIndex]);

  const onSubmit = async (formData: any) =>
    handleSurveySubmit({
      formData,
      surveyData,
      id: id as string,
      clearSavedData,
      clearPageData,
      setSubmissionStatus,
    });

  if (loading) return <div>Loading survey...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!surveyData || groupedQuestions.length === 0) return <div>No survey found</div>;

  const { title, instructions } = surveyData.metadata ?? {};

  return (
    <SurveyLayout title={title ?? ""} instructions={instructions ?? ""}>
      <SurveyForm
        form={form}
        onSubmit={onSubmit}
        currentCategory={currentCategory}
        surveyData={surveyData}
        submissionStatus={submissionStatus}
        prevCategory={prevCategory}
        nextCategory={nextCategory}
        trigger={form.trigger}
        progress={progress}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
    </SurveyLayout>
  );
}
