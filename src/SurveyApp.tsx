// Main refactored SurveyApp.tsx
import { useForm } from "react-hook-form";
import type {
  FormValues,
  QuestionCategory,
  SurveyExport,
  SurveyQuestion,
} from "./types/survey";
// import surveyData from "./data/prototype_amharic_only.json";
import { useSurveyExport } from "./hooks/useSurveyExport";
import { useFormPersistence } from "./hooks/useFormPersistence";
import { useSurveyNavigation } from "./hooks/useSurveyNavigation";
import { QuestionRenderer } from "./components/QuestionRenderer";
import { SurveyNavigation } from "./components/SurveyNavigation";
import { ProgressBar } from "./components/ProgressBar";
import { Header } from "./components/Header.tsx";
import { useMemo } from "react";



export default function SurveyApp({prefix}:{prefix:string}) {
  const form = useForm({});
  const { register, handleSubmit, watch, setValue } = form;
  const { data: surveyData, loading, error } = useSurveyExport(prefix);

  // Watch all form values for persistence and conditional rendering
  const formValues = watch();

  // Custom hooks for form persistence and navigation
  const { clearSavedData } = useFormPersistence(form, formValues);

  // normalize data

  const singleSurvey:SurveyExport|null = useMemo(()=>{
    if (!surveyData) {
      return null
    }
    if (Array.isArray(surveyData)) {
      return null
    }
    return surveyData
  },[])

  // Group questions by category
  // console.log("FROMM",surveyData?.questions)
  let categories;
  if (singleSurvey?.question_categories !== null) {
    categories = singleSurvey?.question_categories;
  }
  const groupedQuestions =
    categories?.map((cat: QuestionCategory) => ({
      ...cat,
      questions: singleSurvey?.questions.filter((q: SurveyQuestion) => {
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

  const onSubmit = (data: FormValues) => {
    console.log("Full survey data:", data);
    clearSavedData();
    clearPageData();
  };

  // Loading and error states
  if (loading) return <div>Loading survey...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!surveyData || groupedQuestions.length === 0)
    return <div>No survey found.</div>;

  // let filtered:Array<any>
  // groupedQuestions.forEach((element) => {
  //   if (element.questions) {

  //   }
  // });
  const currentCategory = groupedQuestions[currentCategoryIndex];

  const { title, instructions } = singleSurvey?.metadata??{};
  return (
    <>
      <Header title={title??""} instructions={instructions??""} />
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
        </div>
      </main>
    </>
  );
}
