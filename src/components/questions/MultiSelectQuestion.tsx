import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";
import { parseOption } from "../../utils/helpers";

interface MultiSelectQuestionProps {
  question: SurveyQuestion;
  control: Control<any>;
}

export const MultiSelectQuestion = ({
  question,
  control,
}: MultiSelectQuestionProps) => {
  const fieldName = String(question.id);

  if (!question.options) return null;

  const { required, min_length, max_length } = question.constraints;

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={[]}
      rules={{
        required: required ? "This field is required" : false,
        // validate: (value: any[]) => {
        //   if (min_length && value.length < min_length) {
        //     return `Select at least ${min_length} options`;
        //   }
        //   if (max_length && value.length > max_length) {
        //     return `Select at most ${max_length} options`;
        //   }
        //   return true;
        // },
      }}
      render={({ field }) => {
        const selectedValues: number[] = field.value || [];

        return (
          <div className="space-y-1">
            {question.options!.map((option) => {
              const { optionLabel, optionId, isOther } = parseOption(option);
              const isChecked = selectedValues.includes(optionId);

              return (
                <div key={optionId} className="flex flex-col gap-1">
                  <label
                    className="flex items-center gap-2"
                    htmlFor={optionId.toString()}
                  >
                    <input
                      type="checkbox"
                      className="select-none accent-amber-500 ms-2 text-sm font-medium text-heading"
                      id={optionId.toString()}
                      checked={isChecked}
                      onChange={(e) => {
                        let updated = [...selectedValues];
                        if (e.target.checked) {
                          updated.push(optionId);
                        } else {
                          updated = updated.filter((id) => id !== optionId);
                        }
                        field.onChange(updated);
                      }}
                    />
                    {optionLabel}
                  </label>

                  {isOther && isChecked && (
                    <Controller
                      name={`${fieldName}_other`}
                      control={control}
                      rules={{
                        required: required ? "This field is required" : false,
                        maxLength: max_length
                          ? {
                              value: max_length,
                              message: `Max ${max_length} characters`,
                            }
                          : undefined,
                        minLength: min_length
                          ? {
                              value: min_length,
                              message: `Min ${min_length} characters`,
                            }
                          : undefined,
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
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
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
};
