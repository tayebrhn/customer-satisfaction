import {
  // useFormContext,
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
// import { useEffect, useRef } from "react";

export function SurveyForm({
  // form,
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
  const { questions: allQuestions, skip_logic } = surveyData;
  // const { watch } = useFormContext();
  // const allFormValues = watch();
  // const allQuestions = surveyData?.questions || [];

  // Convert GroupedQuestion to the format expected by useSkipLogic
  // const skipLogicCategory = currentCategory
  //   ? {
  //       id: currentCategory.id || 0,
  //       cat_number: currentCategory.cat_number || 0,
  //       name: currentCategory.name || "",
  //       questions: currentCategory.questions || [],
  //       // description: currentCategory.description || ''
  //     }
  //   : null;
  const {
    visibleQuestions,
    visibleCategoryQuestions,
    visibleCategoryCount,
    totalCategoryQuestions,
    // handleAnswerChangeWithLogic, // <--- USE THIS
  } = useSkipLogic({
    currentCategory: currentCategory,
    allQuestions,
    skipLogic: skip_logic,
  });

  const {cat_number,name:cat_name} = currentCategory
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Title */}
        <header className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            {`${cat_number}. ${cat_name}`}
          </h1>
        </header>

        <section className="space-y-6">
          {visibleCategoryQuestions?.map((q: SurveyQuestion,index) => (
            <div
              key={q.sequence_num}
              className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="mb-4">
                <label className="block font-medium text-gray-900 text-base sm:text-lg md:text-xl leading-relaxed">
                  {`${cat_number}.${index+1}. `}
                  {q.question}
                  {q.constraints.required && (
                    <span
                      className="text-red-500 ml-1 text-lg"
                      title="Required"
                    >
                      *
                    </span>
                  )}
                </label>
              </div>

              <div className="mt-2">
                <QuestionRenderer
                  question={q}
                  choices={surveyData.key_choice}
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    </form>
  );
}
