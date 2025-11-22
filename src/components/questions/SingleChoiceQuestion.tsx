// components/questions/SingleChoiceQuestion.tsx
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";
import { parseOption } from "../../utils/helpers";

interface SingleChoiceQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const SingleChoiceQuestion = ({
  question,
  register,
  watch,
}: SingleChoiceQuestionProps) => {
  const fieldName = String(question.id);
  const formValues = watch();

  if (!question.options) return null;
  // console.log(question.options[2].is_other)

  const { required, min_length, max_length } = question.constraints;

  return (
    <div className="space-y-1">
      {question.options.map((option) => {
        const { optionValue, optionLabel, optionId, isOther } =
          parseOption(option);
        const isOtherSelected =
          Number(formValues[question.id]) === optionId && isOther;
        return (
          <div key={optionId} className="flex flex-col gap-1">
            <label
              className="flex items-center gap-2"
              htmlFor={optionId.toString()}
            >
              <input
                type="radio"
                className="select-none accent-amber-500 ms-2 text-sm font-medium text-heading"
                value={optionValue}
                id={optionId.toString()}
                {...register(fieldName, {
                  required: required ? `This field is required` : false,
                })}
                // onChange={(e) => setValue(fieldName, e.target.value)}
              />
              {optionLabel}
            </label>

            {isOtherSelected && (
              <input
                {...register(`${fieldName}_other`, {
                  required: required ? `This field is required` : false,
                  maxLength: max_length ? max_length : undefined,
                  minLength: min_length ? min_length : undefined,
                })}
                type="text"
                id={optionId.toString()}
                placeholder="Please specify..."
                className="border p-2 rounded w-auto ml-6 block px-3 py-2
    text-sm text-gray-900
    placeholder-gray-400
    bg-amber-50
   border-gray-300
    shadow
    focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-brand
    transition-colors duration-200"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
