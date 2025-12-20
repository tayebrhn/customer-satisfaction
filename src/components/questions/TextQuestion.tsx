import { useFormContext, type UseFormRegister } from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";
import { GENERIC_ERROR_MSG } from "../../constants/survey";

interface TextQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
}

export const TextQuestion = ({ question, register }: TextQuestionProps) => {
  const fieldName = String(question.sequence_num);
  const {
    formState: { errors },
  } = useFormContext();

  const { required, min_length, max_length } = question.constraints;
  const exactLength = min_length === max_length ? min_length : null;
  // Decide which element to render
  if (question.type === "text_area") {
    return (
      <textarea
        {...register(fieldName, {
          required: required ? GENERIC_ERROR_MSG : false,
          ...(exactLength
            ? {
                validate: (value) =>
                  value.length === exactLength ||
                  `ትክክለኛው ርዝመት ${exactLength} ዲጂት መሆን አለበት`,
              }
            : {
                minLength: min_length
                  ? {
                      value: min_length,
                      message: `ቢያንስ ${min_length} ዲጂት መሆን አለበት`,
                    }
                  : undefined,
                maxLength: max_length
                  ? {
                      value: max_length,
                      message: `ቢበዛ ${max_length} ዲጂት መሆን አለበት`,
                    }
                  : undefined,
              }),
        })}
        onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
          if (max_length && e.currentTarget.value.length > max_length) {
            e.currentTarget.value = e.currentTarget.value.slice(0, max_length);
          }
        }}
        id={question.sequence_num.toString()}
        placeholder={question.placeholder || ""}
        className={`block w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 
    bg-amber-50 border ${
      errors[fieldName]
        ? "border-red-500 ring-1 ring-red-500"
        : "border-gray-300"
    } rounded-md shadow focus:outline-none focus:ring-1 
    focus:ring-amber-500 focus:border-brand transition-colors duration-200`}
      />
    );
  }

  const inputType = question.type === "number" ? "number" : "text";

  return (
    <input
      {...register(fieldName, {
        required: required ? GENERIC_ERROR_MSG : false,
        ...(exactLength
          ? {
              validate: (value) =>
                value.length === exactLength ||
                `ትክክለኛው ርዝመት ${exactLength} ዲጂት መሆን አለበት`,
            }
          : {
              minLength: min_length
                ? {
                    value: min_length,
                    message: `ቢያንስ ${min_length} ዲጂት መሆን አለበት`,
                  }
                : undefined,
              maxLength: max_length
                ? {
                    value: max_length,
                    message: `ቢበዛ ${max_length} ዲጂት መሆን አለበት`,
                  }
                : undefined,
            }),
      })}
      maxLength={max_length || undefined}
      // onInput={(e) => {
      //   if (max_length && e.target.value.length > max_length) {
      //     e.target.value = e.target.value.slice(0, max_length);
      //   }
      // }}
      onInput={(e: React.FormEvent<HTMLInputElement>) => {
        if (max_length && e.currentTarget.value.length > max_length) {
          e.currentTarget.value = e.currentTarget.value.slice(0, max_length);
        }
      }}
      id={question.sequence_num.toString()}
      type={inputType}
      placeholder={question.placeholder || ""}
      className={`block w-full
    px-3 py-2
    text-sm text-gray-900
    placeholder-gray-400
    bg-amber-50
     border ${
       errors[fieldName]
         ? "border-red-500 ring-1 ring-red-500"
         : "border-gray-300"
     } rounded-md
    shadow
    focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-brand
    transition-colors duration-200`}
    />
  );
};
