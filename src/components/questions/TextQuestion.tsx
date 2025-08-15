import type { UseFormRegister } from "react-hook-form";
import type { Question } from "../../types/survey";

interface TextQuestionProps {
  question: Question;
  register: UseFormRegister<any>;
}

export const TextQuestion = ({ question, register }: TextQuestionProps) => {
  const fieldName = String(question.id);
  const inputType = question.type === "number" ? "number" : "text";

  return (
    <input
      {...register(fieldName)}
      type={inputType}
      placeholder={question.placeholder || ""}
      className="border p-2 rounded w-full"
    />
  );
};
