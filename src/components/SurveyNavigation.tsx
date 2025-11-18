import { ProgressBar } from "./ProgressBar";

interface SurveyNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  progress: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  isSubmitting?: boolean; // <-- optional prop
}

export const SurveyNavigation = ({
  onPrevious,
  onNext,
  progress,
  isFirstPage,
  isLastPage,
  isSubmitting = false,
}: SurveyNavigationProps) => {
  return (
    <div className="sticky bottom-0 left-0 w-full bg-white shadow-md p-4 rounded-t-lg">
      <ProgressBar progress={progress} />

      <div className="flex justify-between items-center mt-2">
        {!isFirstPage && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded text-white ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            የቀደም ገጽ
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ml-auto text-white ${
            !isLastPage
              ? "bg-blue-500 hover:bg-blue-600"
              : isSubmitting
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {!isLastPage ? "ቀጣይ" : isSubmitting ? "እየላክን..." : "አስገባ"}
        </button>
      </div>
    </div>
  );
};
