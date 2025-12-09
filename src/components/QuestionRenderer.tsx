// components/QuestionRenderer.tsx
import { useFormContext } from "react-hook-form";
import type { KeyChoice, SurveyQuestion } from "../types/survey";
import { TextQuestion } from "./questions/TextQuestion";
import { SingleChoiceQuestion } from "./questions/SingleChoiceQuestion";
import { RatingQuestion } from "./questions/RatingQuestion";
import { MultiSelectQuestion } from "./questions/MultiSelectQuestion";
import { DropDownQuestion } from "./questions/DropDownQuestion";
import { BsExclamationCircleFill } from "react-icons/bs";

interface QuestionRendererProps {
  question: SurveyQuestion;
  choices: KeyChoice[];
  // register: UseFormRegister<any>;
  // setValue: UseFormSetValue<any>;
  // watch: UseFormWatch<any>;
  // error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

export const QuestionRenderer = ({
  question,
  choices,
}: // register,
// setValue,
// watch,
// error,
QuestionRendererProps) => {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();
  const fieldName = String(question.sequence_num);
  const mainError = errors[fieldName];
  const otherError = errors[`${fieldName}_other`];

  // Watch the main field to handle conditional "Other" input
  // const value = watch(fieldName);
  return (
    <div className="space-y-1">
      {(() => {
        switch (question.type) {
          case "text":
          case "number":
          case "text_area":
            return <TextQuestion question={question} register={register} />;

          case "single_choice":
            return (
              <SingleChoiceQuestion
                question={question}
                register={register}
                setValue={setValue}
                watch={watch}
              />
            );

          case "multi_select":
            return (
              <MultiSelectQuestion question={question} control={control} />
            );
          case "drop_down":
            return (
              <DropDownQuestion
                question={question}
                register={register}
                setValue={setValue}
                watch={watch}
              />
            );

          case "rating":
            return (
              <RatingQuestion
                question={question}
                choices={choices}
                register={register}
              />
            );

          default:
            return null;
        }
      })()}
      {/* Error messages */}
      {mainError && (
        <p className="text-red-500 text-sm mt-1">
          <BsExclamationCircleFill className="inline-block" />{" "}
          {mainError.message as string}
        </p>
      )}
      {otherError && (
        <p className="text-red-500 text-sm mt-1 ml-6">
          <BsExclamationCircleFill className="inline-block" />{" "}
          {otherError.message as string}
        </p>
      )}
    </div>
  );
};
