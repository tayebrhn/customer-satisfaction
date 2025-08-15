import { useForm } from "react-hook-form";
import type { FormValues, Question } from "./types";
import { useEffect, useState } from "react";
import surveyData from "./prototype_amharic_only.json";
import { useSurveyExport } from "./fetch_survey";

const STORAGE_KEY = "survey_form_data";
const PAGE_KEY = "survey_page_index";

export default function SurveyForm() {
  const { register, handleSubmit, watch, setValue, reset } = useForm({});
  const { data: surveyDatad, loading, error } = useSurveyExport(1);

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // We'll watch all form values to detect "Other" selection dynamically
  const formValues = watch();

  console.log(surveyDatad?.question_categories);

  // Group questions by category
  const categories = surveyDatad?.question_categories;
  const groupedQuestions = categories?.map((cat) => ({
    ...cat,
    questions: surveyData.questions.filter(
      (q: Question) => q.category === cat.name
    ),
  }));

  // Restore saved data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedPage = localStorage.getItem(PAGE_KEY);

    if (savedData) {
      try {
        reset(JSON.parse(savedData));
      } catch (err) {
        console.error("Error parsing saved form data", err);
      }
    }

    if (savedPage) {
      setCurrentCategoryIndex(parseInt(savedPage, 10));
    }
  }, [reset]);

  // Auto-save answers and page index
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
  }, [formValues]);

  useEffect(() => {
    localStorage.setItem(PAGE_KEY, String(currentCategoryIndex));
  }, [currentCategoryIndex]);

  const onSubmit = (data: FormValues) => {
    console.log("Full survey data:", data);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PAGE_KEY);
  };

  const renderQuestion = (question: Question) => {
    const fieldName = String(question.id);

    switch (question.type) {
      case "text":
        // TextQuestion
        return (
          <input
            {...register(fieldName)}
            placeholder={question.placeholder || ""}
            className="border p-2 rounded w-full"
          />
        );
      case "number":
        // TextQuestion
        return (
          <input
            {...register(fieldName)}
            type="number"
            placeholder={question.placeholder || ""}
            className="border p-2 rounded w-full"
          />
        );

      case "single_choice":
        // ObjectOptionsQuestion or StringArrayQuestion or ValueLabelQuestion
        return (
          <div className="space-y-1">
            {Array.isArray(question.options) &&
              question.options.map((option, index) => {
                let optionValue: string;
                let optionLabel: string;
                let optionId: string | number;
                let isOther = false;

                if (typeof option === "string") {
                  // StringArrayQuestion
                  optionValue = option;
                  optionLabel = option;
                  optionId = index;
                } else if ("value" in option && "label" in option) {
                  // ValueLabelQuestion
                  optionValue = option.value;
                  optionLabel = option.label;
                  optionId = option.value;
                } else {
                  // ObjectOptionsQuestion
                  optionValue = option.text;
                  optionLabel = option.text;
                  optionId = option.id;
                  isOther = !!option.is_other;
                }

                const isOtherSelected =
                  formValues[question.id] === optionValue && isOther;

                return (
                  <div key={optionId} className="flex flex-col gap-1">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={optionValue}
                        {...register(fieldName)}
                        onChange={(e) => {
                          setValue(fieldName, e.target.value);
                        }}
                      />
                      {optionLabel}
                    </label>

                    {isOtherSelected && (
                      <input
                        {...register(`${fieldName}_other`)}
                        type={"text"}
                        placeholder="Please specify..."
                        className="border p-2 rounded w-auto ml-6"
                      />
                    )}
                  </div>
                );
              })}
          </div>
        );

      case "rating":
        // RatingQuestion
        const scaleCount = question.scale
          ? Number(question.scale.split("-")[1])
          : 5;

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

      default:
        return null;
    }
  };

  if (loading) return <div>Loading survey...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!surveyDatad) return <div>No survey found.</div>;

  const currentCategory = groupedQuestions?.[currentCategoryIndex];
  const progress = ((currentCategoryIndex + 1) / groupedQuestions!.length) * 100;

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl mx-auto"
        >
          {/* <h2 className="text-lg font-semibold mb-4">
            {currentCategory.name} — {currentCategory.name}
          </h2> */}

          {currentCategory?.questions.map((question) => (
            <div key={question.id} className="border p-4 rounded shadow-sm">
              <p className="mb-2 font-medium">{question.question}</p>
              {renderQuestion(question)}
            </div>
          ))}

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

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

            {currentCategoryIndex < groupedQuestions!.length - 1 ? (
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
      </div>
    </main>
  );
}
