import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import type { SurveySubmitResponse } from "./types/survey";

export default function SurveyCompletion() {
  const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // const responseId = params.get("response_id");

  const response = location.state?.response as SurveySubmitResponse;

  if (!response) {
    return <p>No response data found.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🎉 Thank You for Completing the Survey!
        </h1>
        <p className="text-gray-600 mb-6">
          Your responses have been successfully recorded.
        </p>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Survey Completed!</h1>
          {/* Optional: show rewards */}
          {response.award_assigned && (
            <p className="text-green-600">
              You earned a reward: {response.message}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
