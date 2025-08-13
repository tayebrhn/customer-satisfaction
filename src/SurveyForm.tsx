import React, { useState } from "react";
import { useForm } from "react-hook-form";
import surveyData from "./prototype_fixed.json";
import type { Question } from "./types"; // the union type we made earlier

export default function SurveyByCategory() {
  const { register, handleSubmit, watch, setValue } = useForm({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const formValues = watch();

  const categories = surveyData.question_categories;
  const groupedQuestions = categories.map((cat) => ({
    ...cat,
    questions: surveyData.questions.filter(
      (q: Question) => q.category === cat.name
    ),
  }));

  const onSubmit = (data: any) => {
    console.log("Full survey data:", data);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "text":
        return (
          <input
            {...register(String(question.id))}
            placeholder={question.placeholder || ""}
            className="border p-2 rounded w-full"
          />
        );

      case "single_choice":
        return (
          <div className="space-y-1">
            {question.options?.map((option) => {
              const isOtherSelected =
                formValues[question.id] === option.text && option.is_other;

              return (
                <div key={option.id} className="flex flex-col gap-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={option.text}
                      {...register(String(question.id))}
                      onChange={(e) => {
                        setValue(String(question.id), e.target.value);
                      }}
                    />
                    {option.text}
                  </label>
                  {isOtherSelected && (
                    <input
                      className="border p-2 rounded w-full ml-6"
                      placeholder="Please specify..."
                      onChange={(e) =>
                        setValue(String(question.id), e.target.value)
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        );

      case "rating":
        const scaleCount = question.scale
          ? Number(question.scale.split("-")[1])
          : 5;
        return (
          <div className="flex gap-2">
            {Array.from({ length: scaleCount }, (_, i) => i + 1).map((val) => (
              <label key={val} className="flex flex-col items-center">
                <input
                  type="radio"
                  value={val}
                  {...register(String(question.id))}
                />
                {val}
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const currentCategory = groupedQuestions[currentCategoryIndex];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <h1 className="text-xl font-bold mb-4">{surveyData.survey.title}</h1>
      <p className="mb-4">{surveyData.survey.instructions}</p>

      <h2 className="text-lg font-semibold mb-4">
        {currentCategory.name} — {currentCategory.description}
      </h2>

      {currentCategory.questions.map((question) => (
        <div key={question.id} className="border p-4 rounded shadow-sm">
          <p className="mb-2 font-medium">{question.text}</p>
          {renderQuestion(question)}
        </div>
      ))}

      <div className="flex justify-between mt-6">
        {currentCategoryIndex > 0 && (
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setCurrentCategoryIndex((i) => i - 1)}
          >
            Previous
          </button>
        )}

        {currentCategoryIndex < groupedQuestions.length - 1 ? (
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setCurrentCategoryIndex((i) => i + 1)}
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
}
