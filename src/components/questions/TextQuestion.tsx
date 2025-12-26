import { useFormContext, type UseFormRegister } from "react-hook-form";
import { QUESTION_TYPE, type SurveyQuestion } from "../../types/survey";
import { GENERIC_ERROR_MSG } from "../../constants/survey";
import { useRef } from "react";
import { ClearButton } from "../ClearButton";
import { useClearableInput } from "../../hooks/useClearableInput";

interface TextQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
}

export const TextQuestion = ({ question, register }: TextQuestionProps) => {
  const fieldName = String(question.sequence_num);
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const { clear } = useClearableInput({
    inputRef,
    onClearValue: () => {
      setValue(fieldName, "");
    },
  });

  const fieldValue = watch(fieldName);
  const isVisible = !!fieldValue && fieldValue.length > 0;

  const { required, min_length, max_length } = question.constraints;
  const exactLength = min_length === max_length ? min_length : null;

  const { ref: registerRef, ...registerProps } = register(fieldName, {
    required: required ? GENERIC_ERROR_MSG : false,
    ...(exactLength
      ? {
          validate: (value) => {
            if (!value) return true; // let "required" handle empties

            return (
              value.length === exactLength ||
              `ትክክለኛው ርዝመት ${exactLength} ዲጂት መሆን አለበት`
            );
          },
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
  });
  const baseInputStyles = `block w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 
    bg-amber-50 border ${
      errors[fieldName]
        ? "border-red-500 ring-1 ring-red-500"
        : "border-gray-300"
    } rounded-md shadow focus:outline-none focus:ring-1 
    focus:ring-amber-500 focus:border-brand transition-colors duration-200`;

  // // Decide which element to render
  // if (question.type === "text_area") {
  //   return (

  //   );
  // }

  const inputType =
    question.type === QUESTION_TYPE.NUMBER
      ? QUESTION_TYPE.NUMBER
      : QUESTION_TYPE.TEXT;

  return (
    <div className="relative w-full">
      {question.type === QUESTION_TYPE.TEXT_AREA ? (
        <textarea
          {...registerProps}
          ref={(e) => {
            registerRef(e); // Connect React Hook Form
            inputRef.current = e; // Connect our local ref
          }}
          onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
            if (max_length && e.currentTarget.value.length > max_length) {
              e.currentTarget.value = e.currentTarget.value.slice(
                0,
                max_length
              );
            }
          }}
          id={question.sequence_num.toString()}
          placeholder={question.placeholder || ""}
          className={baseInputStyles}
        />
      ) : (
        <input
          {...registerProps}
          onInput={(e: React.FormEvent<HTMLInputElement>) => {
            if (max_length && e.currentTarget.value.length > max_length) {
              e.currentTarget.value = e.currentTarget.value.slice(
                0,
                max_length
              );
            }
          }}
          id={question.sequence_num.toString()}
          type={inputType}
          placeholder={question.placeholder || ""}
          ref={(e) => {
            registerRef(e); // Connect React Hook Form
            inputRef.current = e; // Connect our local ref
          }}
          className={baseInputStyles}
        />
      )}

      <ClearButton visible={isVisible} onClear={clear} />
    </div>
  );
};
