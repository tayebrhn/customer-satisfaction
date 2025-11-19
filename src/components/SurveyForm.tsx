import { useFormContext } from "react-hook-form";
import { QuestionRenderer } from "./QuestionRenderer";
import { SurveyNavigation } from "./SurveyNavigation";
import type {
  SurveyQuestion,
  CurrentCategory,
} from "../types/survey";
// import { useState } from "react";

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
  // const [verifyError, setVerifyError] = useState(null);
  const { handleSubmit } = form;
  const fieldsForCurrentCategory = currentCategory?.questions?.map((q) =>
    String(q.id)
  );
  const { getValues, setError, clearErrors } = useFormContext();

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
        console.log("ERROR:",data.errors)
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <section className="space-y-4">
          {/* <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2">
            {currentCategory?.name}
          </h2> */}

          {currentCategory?.questions?.map((q: SurveyQuestion) => (
            <div key={q.id} className="bg-white shadow-md p-4 rounded-lg">
              <p className="mb-2 font-weight">{q.question}</p>
              <QuestionRenderer question={q} choices={surveyData.key_choice} />
            </div>
          ))}

          <SurveyNavigation
            onPrevious={prevCategory}
            onNext={handleNext}
            progress={progress}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
          />
        </section>
      </form>
  );
}