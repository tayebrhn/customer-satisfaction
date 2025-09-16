import { ProgressBar } from "./ProgressBar";

// components/SurveyNavigation.tsx
interface SurveyNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  progress: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export const SurveyNavigation = ({
  onPrevious,
  onNext,
  onSubmit,
  progress,
  isFirstPage,
  isLastPage,
}: SurveyNavigationProps) => {
  return (
    <>
      <div className="sticky bottom-1 left-0 w-full ">
      <ProgressBar progress={progress} />
        <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
          {!isFirstPage && (
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onPrevious}
            >
              Previous
            </button>
          )}

          {!isLastPage ? (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded ml-auto"
              onClick={onNext}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded ml-auto"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </>
  );
};
