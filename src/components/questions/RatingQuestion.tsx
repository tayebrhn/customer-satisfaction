import type { UseFormRegister } from "react-hook-form";
import type { KeyChoice, SurveyQuestion } from "../../types/survey";
import { GENERIC_ERROR_MSG } from "../../constants/survey";

interface RatingQuestionProps {
  question: SurveyQuestion;
  choices: KeyChoice[];
  register: UseFormRegister<any>;
}

export const RatingQuestion = ({
  question,
  register,
  choices,
}: RatingQuestionProps) => {
  const fieldName = String(question.id);
  const scaleCount = question.scale ? Number(question.scale.split("-")[1]) : 5;
  const { required } = question.constraints;
  console.log("LOG_CHOICES:", choices);
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-start gap-3 sm:gap-4 mt-3">
  {Array.from({ length: scaleCount }, (_, i) => i + 1).map((val) => (
    <div key={val} className="flex flex-col items-center max-w-[50px]">
      
      {/* Hidden radio input as peer */}
      <input
        type="radio"
        id={`rating-${fieldName}-${val}`}
        value={val}
        className="hidden peer"
        {...register(fieldName, {
          required: required ? GENERIC_ERROR_MSG : false,
        })}
      />

      {/* Clickable radio circle */}
      <label
        htmlFor={`rating-${fieldName}-${val}`}
        className="
          flex items-center justify-center
          w-5 h-5 sm:w-7 sm:h-7
          border-2 border-gray-400
          rounded-full
          cursor-pointer
          transition
          peer-checked:bg-amber-500
        "
      >
        <span className="font-semibold peer-checked:scale-110 transition">
          {val}
        </span>
      </label>

      {/* Text description outside */}
      <span className="text-xs sm:text-xs md:text-sm wrap-break-word text-center mt-1">
        {choices[val - 1]?.description ?? ""}
      </span>
    </div>
  ))}
</div>

    </div>
  );
};
