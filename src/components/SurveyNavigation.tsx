import { ProgressBar } from "./ProgressBar";
import {
  BsCaretLeftFill,
  BsCaretRightFill,
  BsCheckCircleFill,
  BsCloudUploadFill,
} from "react-icons/bs";

interface SurveyNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  progress: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  isSubmitting?: boolean; // <-- optional prop
  className:string;
}

export const SurveyNavigation = ({
  onPrevious,
  onNext,
  progress,
  isFirstPage,
  isLastPage,
  isSubmitting = false,
  className
}: SurveyNavigationProps) => {
  return (
    <div className={className}>
      <small className="smallpb-1">
        <small style={{ color: "red" }}>(*)</small> ግዴታ መመለስ ያለበት።
      </small>
      <ProgressBar progress={progress} />

      <div className="flex justify-between items-center mt-2">
        {!isFirstPage && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-2xl text-white ${
              isSubmitting
                ? "bg-amber-300 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-400"
            }`}
          >
            <BsCaretLeftFill className="inline-block" />
            የቀደም ገጽ
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-2xl ml-auto text-white ${
            !isLastPage
              ? "bg-blue-500 hover:bg-blue-600"
              : isSubmitting
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {!isLastPage ? (
            <>
              ቀጣይ
              <BsCaretRightFill className="inline-block" />
            </>
          ) : isSubmitting ? (
            <>
              እየላክን...
              <BsCloudUploadFill className="inline-block" />{" "}
            </>
          ) : (
            <>
              ላክ <BsCheckCircleFill className="inline-block" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
