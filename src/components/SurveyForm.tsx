import { FormProvider } from "react-hook-form";
import { QuestionRenderer } from "./QuestionRenderer";
import { SurveyNavigation } from "./SurveyNavigation";
import type { SurveyQuestion, CurrentCategory } from "../types/survey";

export function SurveyForm({
  form,
  onSubmit,
  currentCategory,
  surveyData,
  submissionStatus,
  prevCategory,
  nextCategory,
  trigger,
  progress,
  isFirstPage,
  isLastPage,
}: {
  form: any;
  onSubmit: (data: any) => void;
  currentCategory: CurrentCategory | undefined;
  surveyData: any;
  submissionStatus: "idle" | "loading" | "success" | "error";
  prevCategory: () => void;
  nextCategory: () => void;
  trigger: (names?: string[]) => Promise<boolean>;
  progress: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}) {
  const { handleSubmit } = form;
  // const fieldsForCurrentCategory = currentCategory?.questions?.map((q) =>
  //   String(q.id)
  // );
const handleNext = async () => {
  const fieldsForCurrentCategory = currentCategory?.questions.map(q => String(q.id));
  const isValid = await trigger(fieldsForCurrentCategory);
  if (!isValid) return;

  if (isLastPage) {
    handleSubmit(onSubmit)(); // submit if final page
  } else {
    nextCategory(); // otherwise, go to next
  }
};

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2">
            {currentCategory?.name}
          </h2>

          {currentCategory?.questions?.map((q: SurveyQuestion) => (
            <div key={q.id} className="bg-white shadow-md p-4 rounded-lg">
              <p className="mb-2 font-weight">{q.label}</p>
              <p>{q.description}</p>
              <QuestionRenderer question={q} choices={surveyData.key_choice} />
            </div>
          ))}

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

          <SurveyNavigation
            onPrevious={prevCategory}
            onNext={handleNext}
            progress={progress}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
          />
        </section>
      </form>
    </FormProvider>
  );
}
