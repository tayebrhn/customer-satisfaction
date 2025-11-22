import type { UseFormRegister } from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";

interface TextQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
}

export const TextQuestion = ({ question, register }: TextQuestionProps) => {
  const fieldName = String(question.id);

  const { required, min_length, max_length } = question.constraints;
  // Decide which element to render
  if (question.type === "text_area") {
    return (
      <textarea
        {...register(fieldName, {
          required: required ? `This field is required` : false,
          maxLength: max_length
            ? {
                value: max_length,
                message: `Must be at most ${max_length} characters`,
              }
            : undefined,
          minLength: min_length
            ? {
                value: min_length,
                message: `Must be at least ${min_length} characters`,
              }
            : undefined,
        })}
        id={question.id.toString()}
        placeholder={question.placeholder || ""}
        className="block w-full
    px-3 py-2
    text-sm text-gray-900
    placeholder-gray-400
    bg-amber-50
    border border-gray-300 rounded-md
    shadow
    focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-brand
    transition-colors duration-200"
      />
    );
  }

  const inputType = question.type === "number" ? "number" : "text";

  return (
    <input
      {...register(fieldName, {
        required: required ? `This field is required` : false,
        maxLength: max_length
          ? {
              value: max_length,
              message: `Must be at most ${max_length} characters`,
            }
          : undefined,
        minLength: min_length
          ? {
              value: min_length,
              message: `Must be at least ${min_length} characters`,
            }
          : undefined,
      })}
      id={question.id.toString()}
      type={inputType}
      placeholder={question.placeholder || ""}
      className="
    block w-full
    px-3 py-2
    text-sm text-gray-900
    placeholder-gray-400
    bg-amber-50
    border border-gray-300 rounded-md
    shadow
    focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-brand
    transition-colors duration-200
  "
    />
  );
};
