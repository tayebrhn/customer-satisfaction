// components/questions/SingleChoiceQuestion.tsx
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { Question } from "../../types/survey";

interface SingleChoiceQuestionProps {
  question: Question;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const SingleChoiceQuestion = ({
  question,
  register,
  setValue,
  watch,
}: SingleChoiceQuestionProps) => {
  const fieldName = String(question.id);
  const formValues = watch();

  if (!question.options) return null;

  return (
    <div className="space-y-1">
      {question.options.map((option, index) => {
        const { optionValue, optionLabel, optionId, isOther } = parseOption(
          option,
          index
        );
        const isOtherSelected =
          formValues[question.id] === optionValue && isOther;

        return (
          <div key={optionId} className="flex flex-col gap-1">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value={optionValue}
                {...register(fieldName)}
                onChange={(e) => setValue(fieldName, e.target.value)}
              />
              {optionLabel}
            </label>

            {isOtherSelected && (
              <input
                {...register(`${fieldName}_other`)}
                type="text"
                placeholder="Please specify..."
                className="border p-2 rounded w-auto ml-6"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Utility function for parsing different option formats
const parseOption = (option: any, index: number) => {
  if (typeof option === "string") {
    return {
      optionValue: option,
      optionLabel: option,
      optionId: index,
      isOther: false,
    };
  } else if ("value" in option && "label" in option) {
    return {
      optionValue: option.value,
      optionLabel: option.label,
      optionId: option.value,
      isOther: false,
    };
  } else {
    return {
      optionValue: option.text,
      optionLabel: option.text,
      optionId: option.id,
      isOther: !!option.is_other,
    };
  }
};
