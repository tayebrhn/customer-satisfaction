// components/questions/DropDownQuestion.tsx
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";
import { parseOption } from "../../utils/helpers";

interface DropDownQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const DropDownQuestion = ({
  question,
  register,
  setValue,
  watch,
}: DropDownQuestionProps) => {
  const fieldName = String(question.id);
  const selectedValue = watch(fieldName);

  if (!question.options) return null;

  return (
    <div className="flex flex-col gap-2">
      <select
        {...register(
          fieldName,
          { onChange: (e) => setValue(fieldName, e.target.value) }
        )}
        className="border p-2 rounded"
        defaultValue=""
      >
        <option value="" disabled>
          -- Select an option --
        </option>
        {question.options.map((option) => {
          const { optionValue, optionLabel, optionId } = parseOption(option);
          return (
            <option key={optionId} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {/* Handle "Other" */}
      {question.options.map((option) => {
        const { optionId, isOther } = parseOption(option);
        const isOtherSelected = Number(selectedValue) === optionId && isOther;

        return (
          isOtherSelected && (
            <input
              key={`${optionId}-other`}
              {...register(`${fieldName}_other`)}
              type="text"
              placeholder="Please specify..."
              className="border p-2 rounded w-auto"
            />
          )
        );
      })}
    </div>
  );
};
