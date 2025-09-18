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
  const fieldsForCurrentCategory = currentCategory?.questions?.map((q) =>
    String(q.id)
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        {currentCategory?.questions?.map((q: SurveyQuestion) => (
          <div key={q.id} className="bg-white shadow-md p-4 rounded-lg">
            <p className="mb-2 font-medium">{q.question}</p>
            <QuestionRenderer question={q} choices={surveyData.key_choice} />
          </div>
        ))}

        {submissionStatus === "loading" && (
          <p className="text-blue-500 mt-4">Submitting...</p>
        )}
        {submissionStatus === "success" && (
          <p className="text-green-600 mt-4">✅ Thank you! Your responses have been submitted.</p>
        )}
        {submissionStatus === "error" && (
          <p className="text-red-600 mt-4">❌ Oops! Something went wrong. Please try again.</p>
        )}

        <SurveyNavigation
          onPrevious={prevCategory}
          onNext={async () => {
            const isValid = await trigger(fieldsForCurrentCategory);
            if (isValid) nextCategory();
          }}
          onSubmit={() => handleSubmit(onSubmit)()}
          progress={progress}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
      </form>
    </FormProvider>
  );
}
