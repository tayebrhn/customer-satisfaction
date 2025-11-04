// SurveyModal.tsx
import { motion, AnimatePresence } from "framer-motion";

export function SurveyModal({
  status,
  onClose,
}: {
  status: "idle" | "loading" | "success" | "error";
  onClose: () => void;
}) {
  if (status === "idle" || status === "loading") return null;

  const isSuccess = status === "success";

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
          className={`w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 text-center`}
        >
          <h2
            className={`text-xl font-semibold mb-2 ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {isSuccess ? "✅ Submission Successful" : "❌ Submission Failed"}
          </h2>
          <p className="text-gray-600 mb-4">
            {isSuccess
              ? "Thank you for filling out the survey!"
              : "There was an issue submitting your responses. Please try again."}
          </p>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded font-medium ${
              isSuccess
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {isSuccess ? "Continue" : "Try Again"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
