import {
  useFormContext,
  type FieldValues,
  type UseFormHandleSubmit,
} from "react-hook-form";
import { QuestionRenderer } from "./QuestionRenderer";
import type {
  SurveyQuestion,
  SurveyExport,
  GroupedQuestion,
} from "../types/survey";
import { useSkipLogic } from "../utils/useSkipLogic";
import { useEffect, useRef } from "react";

export function SurveyForm({
  form,
  onSubmit,
  currentCategory,
  surveyData,
  handleSubmit,
  className,
}: {
  form: any;
  onSubmit: (data: any) => void;
  currentCategory: GroupedQuestion;
  surveyData: SurveyExport;
  handleSubmit: UseFormHandleSubmit<FieldValues, FieldValues>;
  className: string;
}) {
  const { watch } = useFormContext();
  const allFormValues = watch();
  const allQuestions = surveyData?.questions || [];

  // Convert GroupedQuestion to the format expected by useSkipLogic
  const skipLogicCategory = currentCategory
    ? {
        id: currentCategory.id || 0,
        cat_number: currentCategory.cat_number || 0,
        name: currentCategory.name || "",
        questions: currentCategory.questions || [],
        // description: currentCategory.description || ''
      }
    : null;
  const {
    visibleQuestions,
    visibleCategoryQuestions,
    visibleCategoryCount,
    totalCategoryQuestions,
    // handleAnswerChangeWithLogic, // <--- USE THIS
  } = useSkipLogic({
    currentCategory: skipLogicCategory,
    allQuestions,
  });
  return (
    <form
      onKeyDown={(event: React.KeyboardEvent<HTMLFormElement>) => {
        if (
          event.key === "Enter" &&
          !(event.target instanceof HTMLTextAreaElement)
        ) {
          event.preventDefault();
        }
      }}
      onSubmit={handleSubmit(onSubmit)}
      className={className}
    >
      <section className="">
        {visibleCategoryQuestions?.map((q: SurveyQuestion) => (
          <div key={q.sequence_num} className="py-4 rounded-lg">
            <p className="text-xs sm:text-base md:text-lg lg:text-xl">
              {q.question}
              <sup style={{ color: "red", marginLeft: "1px" }}>
                {q.constraints.required ? "*" : ""}
              </sup>
            </p>
            {/* Update QuestionRenderer to use handleAnswerChangeWithLogic */}
            <QuestionRenderer
              question={q}
              choices={surveyData.key_choice}
              // onChange={(value) => handleAnswerChangeWithLogic(q.sequence_num, value, true)}
            />
          </div>
        ))}

        {/* Optional: Show questions that are hidden in this category */}
        {import.meta.env.DEV &&
          totalCategoryQuestions > visibleCategoryCount && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-600 font-medium">
                  Hidden in this category (
                  {totalCategoryQuestions - visibleCategoryCount} questions)
                </summary>
                <div className="mt-2 space-y-1">
                  {currentCategory.questions
                    .filter((q) => !visibleQuestions.has(q.sequence_num))
                    .map((q) => (
                      <div
                        key={q.sequence_num}
                        className="text-gray-500 text-xs p-2 bg-gray-100 rounded"
                      >
                        Q{q.sequence_num}: {q.question.substring(0, 60)}...
                        {q.skip_logic?.map((rule, idx) => (
                          <div key={idx} className="ml-4 text-gray-400">
                            • If Q{rule.trigger_question_sn} {rule.operator}{" "}
                            {rule.trigger_value} → {rule.action}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </details>
            </div>
          )}
      </section>
    </form>
  );
}
