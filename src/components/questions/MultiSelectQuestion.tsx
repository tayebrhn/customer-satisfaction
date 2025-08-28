// components/questions/MultiSelectQuestion.tsx
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";
import { parseOption } from "../../utils/helpers";

interface MultiSelectQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const MultiSelectQuestion = ({
  question,
  register,
  setValue,
  watch,
}: MultiSelectQuestionProps) => {
  const fieldName = String(question.id);
  const formValues = watch();
  const selectedValues: number[] = formValues[question.id] || [];

  if (!question.options) return null;

  return (
    <div className="space-y-1">
      {question.options.map((option) => {
        const { optionLabel, optionId, isOther } = parseOption(option);
        const isChecked = selectedValues.includes(optionId);
        const isOtherSelected = isChecked && isOther;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let updated = [...selectedValues];
          console.log("handleChange",updated)
          if (e.target.checked) {
            updated.push(optionId);
          } else {
            updated = updated.filter((id) => id !== optionId);
          }
          setValue(fieldName, updated, { shouldValidate: true });
        };

        return (
          <div key={optionId} className="flex flex-col gap-1">
            <label className="flex items-center gap-2" htmlFor={optionId.toString()}>
              <input
                type="checkbox"
                id={optionId.toString()}
                checked={isChecked}
                onChange={handleChange}
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

