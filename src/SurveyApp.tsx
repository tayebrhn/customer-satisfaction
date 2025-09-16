// Main refactored SurveyApp.tsx
import { useForm } from "react-hook-form";
import type {
  QuestionCategory,
  SurveyQuestion,
} from "./types/survey";
// import surveyData from "./data/prototype_amharic_only.json";
import { useSurveyFetchOne } from "./hooks/useSurveyFetch.ts";
import { useFormPersistence } from "./hooks/useFormPersistence";
import { useSurveyNavigation } from "./hooks/useSurveyNavigation";
import { QuestionRenderer } from "./components/QuestionRenderer";
import { SurveyNavigation } from "./components/SurveyNavigation";
import { ProgressBar } from "./components/ProgressBar";
import { Header } from "./components/Header.tsx";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function SurveyApp() {
  const { id } = useParams<{ id: string }>();
  // const [searchParams] = useSearchParams();
  // const lang = searchParams.get("lang")
  const form = useForm({});
  const { register, handleSubmit, watch, setValue } = form;
  const { data: surveyData, loading, error } = useSurveyFetchOne(id as string);
  // ✅ UI states for API call
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Watch all form values for persistence and conditional rendering
  const formValues = watch();

  // Custom hooks for form persistence and navigation
  const { clearSavedData } = useFormPersistence(form, formValues);
  

  // Group questions by category
  // console.log("FROMM",surveyData?.questions)
  let categories;
  if (surveyData?.question_categories !== null) {
    categories = surveyData?.question_categories;
  }
  const groupedQuestions =
    categories?.map((cat: QuestionCategory) => ({
      ...cat,
      questions: surveyData?.questions.filter((q: SurveyQuestion) => {
        const match = q.category === cat.id;

        // console.log("groupedQuestions: ",q.category,cat.id)
        // if (match) {
        //   console.log("groupedQuestions: ",q)
        // }
        return match;
      }),
    })) || [];

  const {
    currentCategoryIndex,
    nextCategory,
    prevCategory,
    progress,
    isFirstPage,
    isLastPage,
    clearPageData,
  } = useSurveyNavigation(groupedQuestions.length);


  if (!surveyData) {
    return <>no survey data</>;
  }

  const onSubmit = async (formData: any) => {
    setSubmissionStatus("loading");

    const surveyResponse = {
      survey_id: id,
      respondent_info: {
        ip_address: "192.168.1.1", // can be fetched from backend
        user_agent: navigator.userAgent,
        session_id: "optional_session_identifier",
      },
      responses: surveyData.questions
        .map((q: any) => {
          const fieldValue = formData[q.id];
          const otherValue = formData[`${q.id}_other`] || null;

          switch (q.type) {
            case "single_choice":
              return {
                question_id: q.id,
                question_type: q.type,
                answer: {
                  selected_option_id: Number(fieldValue) || null,
                  text_value: otherValue,
                  ...(otherValue ? { is_other: true } : {}),
                },
              };
            case "multi_select":
              return {
                question_id: q.id,
                question_type: q.type,
                answer: {
                  selected_option_ids: fieldValue || [],
                  text_value: otherValue,
                },
              };
            case "text":
            case "text_area":
              return {
                question_id: q.id,
                question_type: q.type,
                answer: {
                  selected_option_id: null,
                  text_value: fieldValue || "",
                },
              };
            case "number":
              return {
                question_id: q.id,
                question_type: q.type,
                answer: {
                  selected_option_id: null,
                  number_value: Number(fieldValue) || null,
                },
              };
            case "rating":
              return {
                question_id: q.id,
                question_type: q.type,
                answer: {
                  selected_option_id: null,
                  rating_value: Number(fieldValue) || null,
                },
              };
            case "drop_down":
              return {
                question_id: q.id,
                question_type: q.type,
                answer: {
                  selected_option_id: Number(fieldValue) || null,
                  text_value: otherValue,
                },
              };
            default:
              return null;
          }
        })
        .filter(Boolean),
    };

    try {
      const response = await fetch(import.meta.env.VITE_SURVEY_URL_SUBMIT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyResponse),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setSubmissionStatus("success");
      clearSavedData();
      clearPageData();
    } catch (err) {
      console.error("❌ Failed to submit survey:", err);
      setSubmissionStatus("error");
    }
  };

  // Loading and error states
  if (loading) return <div>Loading survey...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!surveyData || groupedQuestions.length === 0)
    return <div>No survey found</div>;

  // let filtered:Array<any>
  // groupedQuestions.forEach((element) => {
  //   if (element.questions) {

  //   }
  // });
  // groupedQuestions.sort()
  const currentCategory = groupedQuestions.sort((a, b) => {
    return a.cat_number - b.cat_number;
  })[currentCategoryIndex];

  const { title, instructions } = surveyData?.metadata ?? {};
  // console.log("SurveyApp:",surveyData.key_choice[0])

  return (
    <>
      <Header title={title ?? ""} instructions={instructions ?? ""} />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-w-2xl mx-auto"
          >
            {/* Render current category questions */}
            {currentCategory?.questions?.map((question: SurveyQuestion) => (
              <div key={question.id} className="border p-4 rounded shadow-sm">
                <p className="mb-2 font-medium">{question.question}</p>
                <QuestionRenderer
                  question={question}
                  choices={surveyData.key_choice}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
              </div>
            ))}

            <ProgressBar progress={progress} />

            <SurveyNavigation
              onPrevious={prevCategory}
              onNext={nextCategory}
              onSubmit={() => handleSubmit(onSubmit)()}
              isFirstPage={isFirstPage}
              isLastPage={isLastPage}
            />
          </form>

          {/* ✅ Show feedback */}
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
        </div>
      </main>
    </>
  );
}
