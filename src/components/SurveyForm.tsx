import { type FieldValues, type UseFormHandleSubmit } from "react-hook-form";
import { QuestionRenderer } from "./QuestionRenderer";
import type { SurveyQuestion, CurrentCategory } from "../types/survey";
// import { useState } from "react";

export function SurveyForm({
  onSubmit,
  currentCategory,
  surveyData,
  handleSubmit,
}: {
  form: any;
  onSubmit: (data: any) => void;
  currentCategory: CurrentCategory | undefined;
  surveyData: any;
  handleSubmit: UseFormHandleSubmit<FieldValues, FieldValues>;
}) {
  // const [verifyError, setVerifyError] = useState(null);
  // const fieldsForCurrentCategory = currentCategory?.questions?.map((q) =>
  //   String(q.id)
  // );

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
      className=""
    >
      <section className="">
        {/* <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2">
            {currentCategory?.name}
          </h2> */}

        {currentCategory?.questions?.map((q: SurveyQuestion) => (
          <div key={q.id} className="py-4 rounded-lg">
            <p className="text-xs sm:text-base md:text-lg lg:text-xl">
              {q.question}
              <sup style={{ color: "red", marginLeft: "1px" }}>
                {q.constraints.required ? "*" : ""}
              </sup>
            </p>
            <QuestionRenderer question={q} choices={surveyData.key_choice} />
          </div>
        ))}
      </section>
    </form>
  );
}
