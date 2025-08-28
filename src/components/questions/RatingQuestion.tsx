// components/questions/RatingQuestion.tsx
import type { UseFormRegister } from "react-hook-form";
import type { SurveyQuestion } from "../../types/survey";

interface RatingQuestionProps {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
}

export const RatingQuestion = ({ question, register }: RatingQuestionProps) => {
  const fieldName = String(question.id);
  const scaleCount = question.scale ? Number(question.scale.split("-")[1]) : 5;

  return (
    <div className="flex gap-2">
      {Array.from({ length: scaleCount }, (_, i) => i + 1).map((val) => (
        <label key={val} className="flex flex-col items-center">
          <input type="radio" value={val} {...register(fieldName)} />
          {val}
        </label>
      ))}
    </div>
  );
};
