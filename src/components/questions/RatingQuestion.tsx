// components/questions/RatingQuestion.tsx
import type { UseFormRegister } from "react-hook-form";
import type { KeyChoice, SurveyQuestion } from "../../types/survey";

interface RatingQuestionProps {
  question: SurveyQuestion;
  choices: KeyChoice[];
  register: UseFormRegister<any>;
}

export const RatingQuestion = ({
  question,
  choices,
  register,
}: RatingQuestionProps) => {
  const fieldName = String(question.id);
  const scaleCount = question.scale ? Number(question.scale.split("-")[1]) : 5;
  // console.log("RatingQuestion:", choices);
  const { required } = question.constraints;
  return (
    <div className="flex gap-2">
      {Array.from({ length: scaleCount }, (_, i) => i + 1).map((val) => (
        <label key={val} className="flex flex-col items-center mx-5">
          <input
            type="radio"
            value={val}
            {...register(fieldName, {
              required: required ? `This field is required` : false,
            })}
          />
          <div className="text-sm text-pretty">
            {choices[val - 1].description}
          </div>
        </label>
      ))}
    </div>
  );
};
