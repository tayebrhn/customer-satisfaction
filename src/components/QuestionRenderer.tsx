// components/QuestionRenderer.tsx
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { KeyChoice, SurveyQuestion } from "../types/survey";
import { TextQuestion } from "./questions/TextQuestion";
import { SingleChoiceQuestion } from "./questions/SingleChoiceQuestion";
import { RatingQuestion } from "./questions/RatingQuestion";
import { MultiSelectQuestion } from "./questions/MultiSelectQuestion";
import { DropDownQuestion } from "./questions/DropDownQuestion";

interface QuestionRendererProps {
  question: SurveyQuestion;
  choices: KeyChoice[];
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const QuestionRenderer = ({
  question,
  choices,
  register,
  setValue,
  watch,
}: QuestionRendererProps) => {
  // console.log("QuestionRenderer:",choices)

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
        <MultiSelectQuestion
          question={question}
          register={register}
          setValue={setValue}
          watch={watch}
        />
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
        <RatingQuestion question={question} choices={choices} register={register} />
      );

    default:
      return null;
  }
};
