import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";

interface SingleChoiceQuestionProps {
  question: SurveyQuestion;
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
  const selectedValue = watch(fieldName);

  // ✅ Normalize options into a clean string array
  const normalizedOptions: string[] = (() => {
    const opts = (question && (question as any).options);
    if (Array.isArray(opts)) {
      return opts.map((o) => (o == null ? "" : String(o))).filter(Boolean);
    }
    if (typeof opts === "string") {
      return opts
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (opts && typeof opts === "object") {
      try {
        return Object.values(opts)
          .map((v) => (v == null ? "" : String(v)))
          .filter(Boolean);
      } catch {
        return [];
      }
    }
    return [];
  })();

  if (normalizedOptions.length === 0) return null;

  const { required, min, max } = question.constraints || {};

  return (
    <div className="space-y-2">
      {normalizedOptions.map((option, index) => {
        const optionId = index; // numeric ID based on position
        const optionLabel = option.trim();
        const isOther = optionLabel.toLowerCase().startsWith("other");
        const isOtherSelected =
          Number(selectedValue) === optionId && isOther;

        return (
          <div key={optionId} className="flex flex-col gap-1">
            <label
              className="flex items-center gap-2 cursor-pointer"
              htmlFor={`${fieldName}_${optionId}`}
            >
              <input
                type="radio"
                id={`${fieldName}_${optionId}`}
                value={optionId}
                checked={Number(selectedValue) === optionId}
                {...register(fieldName, {
                  required: required ? "This field is required" : false,
                })}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setValue(fieldName, val, { shouldValidate: true });
                  // Clear other text when switching options
                  setValue(`${fieldName}_other`, "");
                }}
              />
              {option}
            </label>

            {isOtherSelected && (
              <input
                {...register(`${fieldName}_other`, {
                  required: required ? "This field is required" : false,
                  maxLength: max || undefined,
                  minLength: min || undefined,
                })}
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
