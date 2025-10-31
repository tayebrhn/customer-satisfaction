import type { UseFormRegister } from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";

interface TextQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
}

export const TextQuestion = ({ question, register }: TextQuestionProps) => {
  const fieldName = String(question.id);

  const { required, min, max } = question.constraints;
  // Decide which element to render
  if (question.type === "text_area") {
    return (
      <textarea
        {...register(fieldName, {
          required: required ? `This field is required` : false,
          maxLength: max
            ? {
                value: max,
                message: `Must be at most ${max} characters`,
              }
            : undefined,
          minLength: min
            ? {
                value: min,
                message: `Must be at least ${min} characters`,
              }
            : undefined,
        })}
        id={question.id.toString()}
        placeholder={question.configs.placeholder || ""}
        className="border p-2 rounded w-full min-h-[100px]"
      />
    );
  }

  const inputType = question.type === "number" ? "number" : "text";

  return (
    <input
      {...register(fieldName, {
        required: required ? `This field is required` : false,
        maxLength: max
          ? {
              value: max,
              message: `Must be at most ${max} characters`,
            }
          : undefined,
          
        minLength: min
          ? {
              value: min,
              message: `Must be at least ${min} characters`,
            }
          : undefined,
      })}
      id={question.id.toString()}
      type={inputType}
      placeholder={question.configs.placeholder || ""}
      className="border p-2 rounded w-full"
    />
  );
};
