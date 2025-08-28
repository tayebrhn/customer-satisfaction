import type { UseFormRegister } from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";

interface TextQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
}


export const TextQuestion = ({ question, register }: TextQuestionProps) => {
  const fieldName = String(question.id);

  // Decide which element to render
  if (question.type === "text_area") {
    return (
      <textarea
        {...register(fieldName)}
        id={question.id.toString()}
        placeholder={question.placeholder || ""}
        className="border p-2 rounded w-full min-h-[100px]"
      />
    );
  }

  const inputType = question.type === "number" ? "number" : "text";

  return (
    <input
      {...register(fieldName)}
      id={question.id.toString()}
      type={inputType}
      placeholder={question.placeholder || ""}
      className="border p-2 rounded w-full"
    />
  );
};

