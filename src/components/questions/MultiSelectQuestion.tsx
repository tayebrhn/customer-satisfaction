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

  const { required, min, max } = question.constraints;

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={[]}
      rules={{
        required: required ? "This field is required" : false,
        // validate: (value: any[]) => {
        //   if (min && value.length < min) {
        //     return `Select at least ${min} options`;
        //   }
        //   if (max && value.length > max) {
        //     return `Select at most ${max} options`;
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
                        maxLength: max
                          ? {
                              value: max,
                              message: `Max ${max} characters`,
                            }
                          : undefined,
                        minLength: min
                          ? {
                              value: min,
                              message: `Min ${min} characters`,
                            }
                          : undefined,
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Please specify..."
                          className="border p-2 rounded w-auto ml-6"
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
