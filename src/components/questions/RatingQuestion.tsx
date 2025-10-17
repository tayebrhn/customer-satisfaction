import type { UseFormRegister } from "react-hook-form";
import type { KeyChoice, SurveyQuestion } from "../../types/survey";

interface RatingQuestionProps {
  question: SurveyQuestion;
  choices: KeyChoice[];
  register: UseFormRegister<any>;
}

export const RatingQuestion = ({
  question,
  register,
}: RatingQuestionProps) => {
  const fieldName = String(question.id);
  const scaleCount = question.scale ? Number(question.scale.split("-")[1]) : 5;
  const { required } = question.constraints;

  return (
    <div className="w-full">
      <div
        className="
          flex flex-wrap justify-start gap-3 sm:gap-4
          mt-3
        "
      >
        {Array.from({ length: scaleCount }, (_, i) => i + 1).map((val) => {
          return (
            <label
              key={val}
              className="
                flex flex-col items-center justify-center
               hover:bg-gray-100
                rounded-full p-0.5 sm:p-2 
                cursor-pointer transition
                text-center
              "
            >
              <input
                type="radio"
                value={val}
                className="hidden peer"
                {...register(fieldName, {
                  required: required ? `This field is required` : false,
                })}
              />
              <div
                className="
                  flex items-center justify-center 
                  w-6 h-6 sm:w-8 sm:h-8 
                  border-2 border-gray-400 
                  rounded-full peer-checked:border-blue-500 
                  peer-checked:bg-blue-500 
                  transition
                "
              >
                <span className=" font-semibold peer-checked:scale-110 transition">
                  {val}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
