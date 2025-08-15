// components/SurveyNavigation.tsx
interface SurveyNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export const SurveyNavigation = ({ 
  onPrevious, 
  onNext, 
  onSubmit, 
  isFirstPage, 
  isLastPage 
}: SurveyNavigationProps) => {
  return (
    <div className="flex justify-between mt-6">
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
  );
};

