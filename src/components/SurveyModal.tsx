// SurveyModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SurveySubmitResponse } from "../types/survey";

export function SurveyModal({
  status,
  validationErrors = [],
  response,
  onClose,
}: {
  status: "idle" | "loading" | "success" | "error";
  validationErrors?: { question_sn: number; error: string }[];
  response?: SurveySubmitResponse;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  const isSuccess = status === "success";
  useEffect(() => {
    if (isSuccess && response) {
      navigate("/survey/completion", { state: { response } });
      // window.location.href = `/survey/completion?response_id=${response?.response_id}`;
    }
  }, [isSuccess, response]);
  if (status === "idle" || status === "loading") return null;
  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 text-center"
        >
          <h2
            className={`text-xl font-semibold mb-3 ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {isSuccess ? "✅ Submission Successful" : "❌ Submission Failed"}
          </h2>

          {isSuccess ? (
            <p className="text-gray-600 mb-4">ለዳሰሳ ጥናቱ ተሳትፎዎ እናመሰግናለን! </p>
          ) : validationErrors.length > 0 ? (
            <div className="text-left text-sm text-gray-700 mb-4">
              <p className="font-medium mb-2">አንዳንድ ጥያቄዎች ትኩረት ይፈልጋሉ:</p>
              <ul className="space-y-1">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="text-red-600">
                    • {err.question_sn}: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-600 mb-4">
              An unexpected error occurred. Please try again.
            </p>
          )}

          <button
            onClick={() => {
              if (isSuccess) {
                navigate("/survey/completion", { state: { response } });
              } else {
                onClose();
              }
            }}
            className={`px-4 py-2 rounded font-medium ${
              isSuccess
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {isSuccess ? "ቀጥል" : "ዝጋ"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
